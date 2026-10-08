import { Order, ExpenseRecord } from '../types';

interface QueueItem {
  id: string;
  type: 'order' | 'expense' | 'license' | 'product' | 'user';
  payload: any;
  timestamp: string;
}

const getQueue = (): QueueItem[] => {
  try {
    const saved = localStorage.getItem('crust_sync_queue');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveQueue = (queue: QueueItem[]) => {
  try {
    localStorage.setItem('crust_sync_queue', JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to save sync queue:', err);
  }
};

export const getSyncQueueCount = (): number => {
  return getQueue().length;
};

const processQueue = async (webAppUrl: string) => {
  if (!webAppUrl || !navigator.onLine) return;
  const queue = getQueue();
  if (queue.length === 0) return;

  const remainingQueue: QueueItem[] = [];

  for (const item of queue) {
    try {
      await fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload)
      });
    } catch (err) {
      console.error('Failed to sync queued item:', err);
      remainingQueue.push(item);
    }
  }

  saveQueue(remainingQueue);
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    const settings = localStorage.getItem('crust_settings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        if (parsed.googleSheetWebAppUrl) {
          processQueue(parsed.googleSheetWebAppUrl);
        }
      } catch {}
    }
  });
}

export const syncOrderToGoogleSheet = async (order: Order, webAppUrl: string, clientName: string) => {
  if (!webAppUrl) return;

  const payload = {
    action: 'sync_order',
    sheet: 'Orders',
    client: clientName,
    payload: {
      ClientName: clientName,
      OrderNumber: order.orderNumber,
      Type: order.type,
      Status: order.status,
      CustomerName: order.customer?.name || 'Walk-in',
      CustomerPhone: order.customer?.phone || '',
      TotalPKR: order.total,
      PaymentMethod: order.paymentMethod,
      PaymentStatus: order.paymentStatus,
      Cashier: order.cashierName,
      Date: order.createdAt
    }
  };

  if (!navigator.onLine) {
    const queue = getQueue();
    queue.push({ id: `q-${Date.now()}-${Math.random()}`, type: 'order', payload, timestamp: new Date().toISOString() });
    saveQueue(queue);
    return;
  }

  try {
    await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    processQueue(webAppUrl);
  } catch (err) {
    const queue = getQueue();
    queue.push({ id: `q-${Date.now()}-${Math.random()}`, type: 'order', payload, timestamp: new Date().toISOString() });
    saveQueue(queue);
  }
};

export const syncExpenseToGoogleSheet = async (expense: ExpenseRecord, webAppUrl: string, clientName: string) => {
  if (!webAppUrl) return;

  const payload = {
    action: 'sync_expense',
    sheet: 'Expenses',
    client: clientName,
    payload: {
      ClientName: clientName,
      Category: expense.category,
      AmountPKR: expense.amount,
      Description: expense.description,
      Date: expense.date,
      RecordedBy: expense.recordedBy
    }
  };

  if (!navigator.onLine) {
    const queue = getQueue();
    queue.push({ id: `q-${Date.now()}-${Math.random()}`, type: 'expense', payload, timestamp: new Date().toISOString() });
    saveQueue(queue);
    return;
  }

  try {
    await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    processQueue(webAppUrl);
  } catch (err) {
    const queue = getQueue();
    queue.push({ id: `q-${Date.now()}-${Math.random()}`, type: 'expense', payload, timestamp: new Date().toISOString() });
    saveQueue(queue);
  }
};

export const fetchAllDataFromGoogleSheet = async (webAppUrl: string, clientName: string): Promise<any> => {
  if (!webAppUrl || !navigator.onLine) return null;
  try {
    const res = await fetch(`${webAppUrl}?client=${encodeURIComponent(clientName)}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch data from Google Sheet:', err);
    return null;
  }
};

export const APPS_SCRIPT_TEMPLATE = `
function setupAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var tables = {
    'Orders': ['ClientName', 'OrderNumber', 'Type', 'Status', 'CustomerName', 'CustomerPhone', 'TotalPKR', 'PaymentMethod', 'PaymentStatus', 'Cashier', 'Date'],
    'Expenses': ['ClientName', 'Category', 'AmountPKR', 'Description', 'Date', 'RecordedBy'],
    'Users': ['ClientName', 'Name', 'Email', 'Role', 'Phone', 'Pin', 'Active'],
    'Products': ['ClientName', 'Name', 'Category', 'PriceLarge', 'PriceMedium', 'PriceSmall', 'Available'],
    'Inventory': ['ClientName', 'ItemName', 'SKU', 'Category', 'CurrentStock', 'MinStock', 'PurchasePrice'],
    'Licenses': ['ClientName', 'ClientEmail', 'LicenseKey', 'DurationDays', 'ExpiryDate', 'Status', 'CreatedAt']
  };

  for (var sheetName in tables) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(tables[sheetName]);
      sheet.getRange(1, 1, 1, tables[sheetName].length).setFontWeight('bold');
    } else {
      // Ensure headers exist
      var firstRow = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
      if (!firstRow || firstRow[0] === '') {
        sheet.clear();
        sheet.appendRow(tables[sheetName]);
        sheet.getRange(1, 1, 1, tables[sheetName].length).setFontWeight('bold');
      }
    }
  }
}

function resetAndSetupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    ss.deleteSheet(sheets[i]);
  }
  setupAllSheets();
  
  var userSheet = ss.getSheetByName('Users');
  userSheet.appendRow(['Default Client', 'Super Admin', 'admin@pos.com', 'Super Admin', '03001234567', '1234', true]);
}

function seedDummyData(clientName) {
  setupAllSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var prodSheet = ss.getSheetByName('Products');
  if (prodSheet.getLastRow() <= 1) {
    var sampleProducts = [
      [clientName, 'Chicken Fajita Pizza', 'Pizzas', 1499, 1099, 799, true],
      [clientName, 'Classic Pepperoni Pizza', 'Pizzas', 1599, 1199, 899, true],
      [clientName, 'Garlic Bread Supreme', 'Appetizers', 499, 399, 299, true],
      [clientName, 'Chocolate Lava Cake', 'Desserts', 599, 499, 399, true],
      [clientName, '1.5L Soft Drink', 'Beverages', 299, 299, 199, true]
    ];
    sampleProducts.forEach(function(row) { prodSheet.appendRow(row); });
  }

  var userSheet = ss.getSheetByName('Users');
  var usersData = userSheet.getDataRange().getValues();
  var hasUser = false;
  for (var i = 1; i < usersData.length; i++) {
    if (usersData[i][0] === clientName) { hasUser = true; break; }
  }
  if (!hasUser) {
    userSheet.appendRow([clientName, 'Super Admin', 'admin@pos.com', 'Super Admin', '03001234567', '1234', true]);
  }
}

function doGet(e) {
  try {
    setupAllSheets();
    var client = e && e.parameter && e.parameter.client ? e.parameter.client : '';
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var result = {};

    sheets.forEach(function(sheet) {
      var name = sheet.getName();
      var rows = sheet.getDataRange().getValues();
      if (rows.length > 1) {
        var headers = rows[0];
        var data = [];
        var clientColIdx = headers.indexOf('ClientName');

        for (var i = 1; i < rows.length; i++) {
          var row = rows[i];
          // If fetching for a specific client (and not fetching all licenses/users for Super Admin), filter by client name
          if (client && name !== 'Licenses' && clientColIdx !== -1 && row[clientColIdx] && row[clientColIdx] !== client) {
            continue;
          }
          var obj = {};
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
          }
          data.push(obj);
        }
        result[name] = data;
      } else {
        result[name] = [];
      }
    });

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    setupAllSheets();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var sheetName = data.sheet || 'GeneralData';
    var payload = data.payload;

    if (data.action === 'reset_sheets') {
      resetAndSetupSheets();
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', reset: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === 'seed_dummy') {
      seedDummyData(data.client);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', seeded: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (payload && typeof payload === 'object') {
        sheet.appendRow(Object.keys(payload));
      }
    }

    var headersRange = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn()));
    var headers = headersRange.getValues()[0];

    if (!headers || headers.length === 0 || headers[0] === '') {
      if (payload && typeof payload === 'object') {
        headers = Object.keys(payload);
        sheet.appendRow(headers);
      }
    }

    // Build row array strictly matching current sheet headers
    var rowData = headers.map(function(h) {
      return payload[h] !== undefined ? payload[h] : '';
    });

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
