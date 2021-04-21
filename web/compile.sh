tput reset;
sudo kill -9 $(pgrep -f 'app-geckos-server.js');
sudo node app-geckos-server.js > /tmp/app-geckos-server.log & echo "Node server started ...";
firefox http://localhost/stella/web/render_web.html &
/home/unknown/stella/configure &&
make -C /home/unknown/stella && 
/home/unknown/stella/stella -holdreset /home/unknown/Downloads/Enduro\ \(USA\).zip;
#/home/unknown/stella/stella -holdreset /home/unknown/Downloads/River\ Raid\ \(USA\).zip;
#/home/unknown/stella/stella -holdreset /home/unknown/Downloads/Seaquest.zip;
#/home/unknown/stella/stella -holdreset /home/unknown/Downloads/Turmoil\ \(USA\).zip;