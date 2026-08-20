@echo off
title Local RAG Project (Microsoft AI)
color 0B
echo ===================================================
echo      Microsoft AI Innovators - Local RAG Projesi
echo ===================================================
echo.
echo Sunucu baslatiliyor... Lutfen bekleyin.
echo.
echo ===================================================
echo GOREV YONETICI:
echo 1. Tarayiciniz otomatik olarak acilacaktir.
echo 2. Acilmazsa su adrese gidin: http://localhost:3000
echo.
echo KAPANIS:
echo Programi durdurmak icin BU PENCEREYI (Sag ustteki X tusundan)
echo kapatmaniz yeterlidir.
echo ===================================================
echo.

:: Tarayıcıyı otomatik aç
start http://localhost:3000

:: Klasöre git ve node sunucusunu çalıştır
cd /d "C:\Users\yigit\Desktop\local-rag-project"
node server.js
