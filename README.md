# package-delivery-service

##  steps to run the project

1. install and run/open git bash(or any terminal)
2. navigate the project folder location and run below commands
3. cd package-delivery-service
4. npm install

# run using ts-node (dev)
npx ts-node src/index.ts sample_input.txt
# or build+run
npm run build
node dist/index.js sample_input.txt
```

## Example input — `sample_input.txt`

```
100 5
PKG1 50 30 OFR001
PKG2 75 125 OFR002
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200
```