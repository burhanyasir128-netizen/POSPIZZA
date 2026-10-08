import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = path.resolve(__dirname, 'google_sheet_config.json');

async function createServer() {
  const app = express();
  app.use(express.json());

  // API to save Google Sheet URL to a file
  app.post('/api/save-google-sheet-url', (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const config = { googleSheetWebAppUrl: url };
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
      console.log(`Saved Google Sheet URL to ${CONFIG_FILE}`);
      res.json({ success: true, message: 'URL saved to code successfully' });
    } catch (err) {
      console.error('Failed to save config file:', err);
      res.status(500).json({ error: 'Failed to save configuration to file' });
    }
  });

  // API to get the saved URL
  app.get('/api/get-google-sheet-url', (req, res) => {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
        res.json(JSON.parse(data));
      } else {
        res.json({ googleSheetWebAppUrl: '' });
      }
    } catch (err) {
      res.json({ googleSheetWebAppUrl: '' });
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

createServer();
