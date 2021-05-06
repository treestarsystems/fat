
# fat
## Description:  
Financial Asset Tracker  

## How to Run:
Run:
- Production
```
npm start
```

Save for startup: https://pm2.keymetrics.io/docs/usage/startup/

Once you started all the applications you want to manage using the lines above:
```
pm2 save
pm2 startup systemd
```

Other Process Commands:
- Development
```
npm run dev
```
- Stop Instance
```
npm run stop-instance
```
- Status of Instance
```
npm run status-instance
```
- Restart Instance
```
npm run restart-instance
```
- Delete Instance
```
npm run delete-instance
```
- Show Instance Logs
```
npm run log-instance
```
 
