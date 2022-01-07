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

#ifndef TIA_AUDIO_HXX
#define TIA_AUDIO_HXX

class AudioQueue;

#include "bspf.hxx"
#include "AudioChannel.hxx"
#include "Serializable.hxx"
#include "Settings.hxx"

#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>

class Audio : public Serializable
{
  public:
    Audio(Settings& settings);

    void reset();

    void setAudioQueue(const shared_ptr<AudioQueue>& queue);

    /**
      Enable/disable pushing audio samples. These are required for TimeMachine
      playback with sound.
    */
    void setAudioRewindMode(bool enable)
    {
    #ifdef GUI_SUPPORT
      myRewindMode = enable;
    #endif
    }

    void tick();

    AudioChannel& channel0();

    AudioChannel& channel1();

    /**
      Serializable methods (see that class for more information).
    */
    bool save(Serializer& out) const override;
    bool load(Serializer& in) override;

  private:
    void phase1();
    void addSample(uInt8 sample0, uInt8 sample1);

    /**
     * ** SOCKET **
     */
    /**
     * Open socket connection
     */
    bool openSocket();

    Int8 findIndex(Int16 value);

    std::string to_zero_lead(const uInt32 value, const unsigned precision);

    Settings& mySettings;

    /**
     * Send udp data packets if STREAM_SUPPORT
     */
    bool udpSend(const char *msg);

    sockaddr_in servaddr;
    int fd;
    uInt32 packetSequence;
    /**
     * end UDP send
     */
    
  private:
    shared_ptr<AudioQueue> myAudioQueue;

    uInt8 myCounter{0};

    AudioChannel myChannel0;
    AudioChannel myChannel1;

    std::array<Int16, 0x1e + 1> myMixingTableSum;
    std::array<Int16, 0x0f + 1> myMixingTableIndividual;

    Int16* myCurrentFragment{nullptr};
    uInt32 mySampleIndex{0};
  #ifdef GUI_SUPPORT
    bool myRewindMode{false};
    mutable ByteArray mySamples;
  #endif

  private:
    Audio(const Audio&) = delete;
    Audio(Audio&&) = delete;
    Audio& operator=(const Audio&) = delete;
    Audio& operator=(Audio&&) = delete;
};

#endif // TIA_AUDIO_HXX
