#!/bin/bash
# Projenin root dizinine git
cd /home/ec2-user/compman

# PM2 ile uygulamayı yeniden başlat veya başlat
# "my-app" yerine projenizin adını yazın
pm2 restart compman || pm2 start npm --name "compman" -- run dev