const express = require('express');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>MyApp on K8s</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px 48px; max-width: 560px; width: 100%; box-shadow: 0 25px 50px rgba(0,0,0,0.4); }
        .badge { display: inline-block; background: #10b981; color: #fff; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 99px; margin-bottom: 20px; letter-spacing: 0.5px; }
        h1 { font-size: 28px; font-weight: 700; color: #f8fafc; margin-bottom: 8px; }
        .subtitle { color: #94a3b8; font-size: 15px; margin-bottom: 32px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .info-box { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 16px; }
        .info-box .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .info-box .value { font-size: 14px; color: #38bdf8; font-weight: 500; word-break: break-all; }
        .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #334155; font-size: 13px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">✓ RUNNING ON KUBERNETES</span>
        <h1>Hello from MyApp 🚀</h1>
        <p class="subtitle">Deployed via Docker → ECR → K8s</p>
        <div class="info-grid">
          <div class="info-box">
            <div class="label">Pod Name</div>
            <div class="value">${os.hostname()}</div>
          </div>
          <div class="info-box">
            <div class="label">Platform</div>
            <div class="value">${os.platform()} / ${os.arch()}</div>
          </div>
          <div class="info-box">
            <div class="label">Node.js</div>
            <div class="value">${process.version}</div>
          </div>
          <div class="info-box">
            <div class="label">Uptime</div>
            <div class="value">${Math.floor(process.uptime())}s</div>
          </div>
        </div>
        <div class="footer">MyApp v1.0.0 &nbsp;·&nbsp; ${new Date().toUTCString()}</div>
      </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', hostname: os.hostname(), uptime: process.uptime() });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
