/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { LoginView } from './components/LoginView';
import { LicenseActivationView } from './components/LicenseActivationView';
import { isLicenseValid } from './services/license';

import { DashboardView } from './components/DashboardView';
import { POSView } from './components/POSView';
import { OrdersView } from './components/OrdersView';
import { CustomersView } from './components/CustomersView';
import { DeliveryView } from './components/DeliveryView';
import { InventoryView } from './components/InventoryView';
import { PurchasesView } from './components/PurchasesView';
import { ExpensesView } from './components/ExpensesView';
import { ShiftsView } from './components/ShiftsView';
import { ProductsView } from './components/ProductsView';
import { DealsView } from './components/DealsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { LicenseManagerView } from './components/LicenseManagerView';

function MainApp() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<string>('pos');
  const [licenseValid, setLicenseValid] = useState<boolean>(isLicenseValid());

  if (!licenseValid) {
    return <LicenseActivationView onActivated={() => setLicenseValid(true)} />;
  }

  if (!currentUser) {
    return <LoginView />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'pos': return <POSView />;
      case 'orders': return <OrdersView />;
      case 'customers': return <CustomersView />;
      case 'delivery': return <DeliveryView />;
      case 'inventory': return <InventoryView />;
      case 'purchases': return <PurchasesView />;
      case 'expenses': return <ExpensesView />;
      case 'shifts': return <ShiftsView />;
      case 'products': return <ProductsView />;
      case 'deals': return <DealsView />;
      case 'reports': return <ReportsView />;
      case 'licenseManager': return <LicenseManagerView />;
      case 'settings': return <SettingsView />;
      default: return <POSView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
