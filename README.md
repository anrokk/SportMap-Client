# 🗺️ SportMap Client

A single-page web application built to visualize GPS tracks in real time using [Leaflet.js](https://leafletjs.com/). This project is part of a university assignment that connects to the public backend at sportmap.akaver.com, a RESTful API documented with Swagger (OpenAPI). The backend simulates live GPS tracking from mobile devices.

## 🌐 Live Demo

Deployed version available at:  
https://enos.itcollege.ee/~anrokk/sportmap-client

> Recommended to use a desktop browser for the best experience.

---

## 🔧 Features

- 📍 **Interactive Map** view using Leaflet
- 📊 **Track Visualization**: Display selected GPS tracks on the map with polylines
- ♻️ **Live Updates**: Automatically refreshes map data every 10 seconds (configurable)
- 🔍 **Track Filtering**: Filter tracks by their type (Running, Cycling etc.)
- 🔐 **User Authentication**: Logged-in users can view and manage their own tracks

---

## 📦 Tech Stack

- **TypeScript**
- **Vue.js**
- **Leaflet.js**
- **Axios**
- **Pinia**
- **Token-based Authentication**
- **REST API**
