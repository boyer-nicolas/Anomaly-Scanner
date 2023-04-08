# MICHELIN-TIRE-ANOMALY-SCANNER

## Introduction

This is a simple anomaly scanner for Michelin tires. It uses Firebase authentication and the basic Mozilla Barcode API to scan the barcodes of the tires. It then uses the Firebase Realtime Database to store the data and the Firebase Cloud Functions to process the data. The data is then displayed in a simple web app.

## Deployment on Staging

Pattern vx : vx.x.x-beta

### Create the release branch

`git checkout -b releases/vx.x.x-beta origin/<feature-branch>`

### Tag the version

`git tag -a vx.x.x-beta -m 'The release message'`

### Publish the version

`git push --follow-tags --set-upstream origin releases/vx.x.x-beta`

## Deployment on Production

Pattern vx : vx.x.x

### Creat the release branch

`git checkout -b releases/vx.x.x origin/<feature-branch>`

### Tag the version

`git tag -a vx.x.x -m 'The release message'`

### Publish the version

`git push --follow-tags --set-upstream origin releases/vx.x.x`
