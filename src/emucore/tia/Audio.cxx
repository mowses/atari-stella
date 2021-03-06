//============================================================================
//
//   SSSS    tt          lll  lll
//  SS  SS   tt           ll   ll
//  SS     tttttt  eeee   ll   ll   aaaa
//   SSSS    tt   ee  ee  ll   ll      aa
//      SS   tt   eeeeee  ll   ll   aaaaa  --  "An Atari 2600 VCS Emulator"
//  SS  SS   tt   ee      ll   ll  aa  aa
//   SSSS     ttt  eeeee llll llll  aaaaa
//
// Copyright (c) 1995-2022 by Bradford W. Mott, Stephen Anthony
// and the Stella Team
//
// See the file "License.txt" for information on usage and redistribution of
// this file, and for a DISCLAIMER OF ALL WARRANTIES.
//============================================================================

#include "Audio.hxx"
#include "AudioQueue.hxx"

#include <cmath>

namespace {
  constexpr double R_MAX = 30.;
  constexpr double R = 1.;

  Int16 mixingTableEntry(uInt8 v, uInt8 vMax)
  {
    return static_cast<Int16>(
      floor(0x7fff * double(v) / double(vMax) * (R_MAX + R * double(vMax)) / (R_MAX + R * double(v)))
    );
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Audio::Audio(Settings& settings):
mySettings{settings}
{
  for (uInt8 i = 0; i <= 0x1e; ++i) myMixingTableSum[i] = mixingTableEntry(i, 0x1e);
  for (uInt8 i = 0; i <= 0x0f; ++i) myMixingTableIndividual[i] = mixingTableEntry(i, 0x0f);

  reset();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
void Audio::reset()
{
  myCounter = 0;
  mySampleIndex = 0;

  myChannel0.reset();
  myChannel1.reset();

  #ifdef STREAM_SUPPORT
    packetSequence = 0;
    close(fd);
    openSocket();
  #endif
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
void Audio::setAudioQueue(const shared_ptr<AudioQueue>& queue)
{
  myAudioQueue = queue;

  myCurrentFragment = myAudioQueue->enqueue();
  mySampleIndex = 0;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
void Audio::tick()
{
  switch (myCounter) {
    case 9:
    case 81:
      myChannel0.phase0();
      myChannel1.phase0();

      break;

    case 37:
    case 149:
      phase1();
      break;
  }

  if (++myCounter == 228) myCounter = 0;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
void Audio::phase1()
{
  uInt8 sample0 = myChannel0.phase1();
  uInt8 sample1 = myChannel1.phase1();

  addSample(sample0, sample1);
#ifdef GUI_SUPPORT
  if(myRewindMode)
    mySamples.push_back(sample0 | (sample1 << 4));
#endif
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
void Audio::addSample(uInt8 sample0, uInt8 sample1)
{
  if(!myAudioQueue) return;

  if(myAudioQueue->isStereo()) {
    myCurrentFragment[2 * mySampleIndex] = myMixingTableIndividual[sample0];
    myCurrentFragment[2 * mySampleIndex + 1] = myMixingTableIndividual[sample1];
  }
  else {
    myCurrentFragment[mySampleIndex] = myMixingTableSum[sample0 + sample1];
  }

  // cerr << "IS STEREO:" << myAudioQueue->isStereo() << "|fragment size:" << myAudioQueue->fragmentSize() << "--"<< endl;

  if(++mySampleIndex == myAudioQueue->fragmentSize()) {
    #ifdef STREAM_SUPPORT
      // my gambi
      Int16 last = 0;
      string msg_str = "";
      // cerr << "===BEFORE===\n";
      for (std::size_t i = 0; i < mySampleIndex; ++i) {
        // cerr << "myCurrentFragment[" << std::to_string(i) << "] = " << std::to_string(myCurrentFragment[i]) << "\n";
        if (myCurrentFragment[i] == last) continue;

        // o correto seria usar 10 (comprimento de uInt32) ao inves de 5 para i
        // mas quero economizar trafego na rede
        // se tiver problemas no recebimento dos dados, deve-se entao, alterar aqui
        msg_str = msg_str + to_zero_lead(i, 5) + to_zero_lead(findIndex(myCurrentFragment[i]), 2);
        // cerr << "-last was:" << std::to_string(last);
        // cerr << "-INDEX IS:" << std::to_string(findIndex(myCurrentFragment[i]));
        // cerr << "\n";
        last = myCurrentFragment[i];
      }
      if (msg_str != "") {
        msg_str = to_zero_lead(++packetSequence, 5) + msg_str;
        udpSend(msg_str.c_str());
      }
    #endif


    mySampleIndex = 0;
    myCurrentFragment = myAudioQueue->enqueue(myCurrentFragment);
    // cerr << "===AFTER===\n";
    // for (std::size_t i = 0; i < myAudioQueue->fragmentSize(); ++i) {
    //   cerr << "myCurrentFragment[" << std::to_string(i) << "] = " << std::to_string(myCurrentFragment[i]) << "\n";
    // }
  }
}

bool Audio::openSocket(){
  fd = socket(AF_UNIX,SOCK_DGRAM,0);
  if(fd<0){
      cerr << "cannot open socket for audio";
      return false;
  }

  memset(&servaddr, 0, sizeof(struct sockaddr_un));
  servaddr.sun_family = AF_UNIX;
  strcpy(servaddr.sun_path, mySettings.getString("stream.audio").c_str());

  return true;
}

bool Audio::udpSend(const char *msg){
    if (sendto(fd, msg, strlen(msg), 0,
               (struct sockaddr*)&servaddr, sizeof(servaddr)) < 0){
        // cerr << "cannot send message to socket " << mySettings.getString("stream.audio").c_str() << endl;
        return false;
    }
    // cerr << "audio sent to socket" << mySettings.getString("stream.audio").c_str() << endl;
    return true;
}

std::string Audio::to_zero_lead(const uInt32 value, const unsigned precision)
{
     std::ostringstream oss;
     oss << std::setw(precision) << std::setfill('0') << value;
     return oss.str();
}
Int8 Audio::findIndex(Int16 value)
{
  if (myAudioQueue->isStereo()) {
    auto list = myMixingTableIndividual;
    std::size_t t = list.size();
    for (std::size_t i = 0; i < t; ++i) {
      if (list[i] == value) {
        return i;
      }
    }
  } else {
    auto list = myMixingTableSum;
    std::size_t t = list.size();
    for (std::size_t i = 0; i < t; ++i) {
      if (list[i] == value) {
        return i;
      }
    }
  }

  return 0;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AudioChannel& Audio::channel0()
{
  return myChannel0;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
AudioChannel& Audio::channel1()
{
  return myChannel1;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
bool Audio::save(Serializer& out) const
{
  try
  {
    out.putByte(myCounter);

    // The queue starts out pristine after loading, so we don't need to save
    // any other parts of our state

    if (!myChannel0.save(out)) return false;
    if (!myChannel1.save(out)) return false;
  #ifdef GUI_SUPPORT
    out.putLong(uInt64(mySamples.size()));
    out.putByteArray(mySamples.data(), mySamples.size());

    // TODO: check if this improves sound of playback for larger state gaps
    //out.putInt(mySampleIndex);
    //out.putShortArray((uInt16*)myCurrentFragment, myAudioQueue->fragmentSize());

    mySamples.clear();
  #endif
  }
  catch(...)
  {
    cerr << "ERROR: TIA_Audio::save" << endl;
    return false;
  }

  return true;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
bool Audio::load(Serializer& in)
{
  try
  {
    myCounter = in.getByte();

    if (!myChannel0.load(in)) return false;
    if (!myChannel1.load(in)) return false;
  #ifdef GUI_SUPPORT
    uInt64 sampleSize = in.getLong();
    unique_ptr<uInt8[]> samples = make_unique<uInt8[]>(sampleSize);
    in.getByteArray(samples.get(), sampleSize);

    //mySampleIndex = in.getInt();
    //in.getShortArray((uInt16*)myCurrentFragment, myAudioQueue->fragmentSize());

    // Feed all loaded samples into the audio queue
    for(size_t i = 0; i < sampleSize; i++)
    {
      uInt8 sample = samples[i];
      uInt8 sample0 = sample & 0x0f;
      uInt8 sample1 = sample >> 4;

      addSample(sample0, sample1);
    }
  #endif
  }
  catch(...)
  {
    cerr << "ERROR: TIA_Audio::load" << endl;
    return false;
  }

  return true;
}
