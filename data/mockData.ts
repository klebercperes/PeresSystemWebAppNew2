import type { Client, Ticket, Asset } from '../types';

export const clients: Client[] = [
  { id: 'c1', companyName: 'Innovate Corp', contactPerson: 'Alice Johnson', email: 'alice@innovate.com', phone: '123-456-7890', createdAt: '2023-01-15' },
  { id: 'c2', companyName: 'Synergy Solutions', contactPerson: 'Bob Williams', email: 'bob@synergy.com', phone: '234-567-8901', createdAt: '2023-02-20' },
  { id: 'c3', companyName: 'Quantum Dynamics', contactPerson: 'Charlie Brown', email: 'charlie@quantum.com', phone: '345-678-9012', createdAt: '2023-03-10' },
  { id: 'c4', companyName: 'Apex Innovations', contactPerson: 'Diana Miller', email: 'diana@apex.com', phone: '456-789-0123', createdAt: '2023-04-12' },
];

export const tickets: Ticket[] = [
  { id: 't1', subject: 'Server is down', clientId: 'c1', contact: { name: 'Alice Johnson', email: 'alice@innovate.com', phone: '123-456-7890' }, assetId: 'a1', status: 'Open', description: 'The main web server is not responding to pings or HTTP requests.', createdAt: '2023-04-01' },
  { id: 't2', subject: 'Cannot access email', clientId: 'c2', contact: { name: 'Bob Williams', email: 'bob@synergy.com', phone: '234-567-8901' }, assetId: 'a3', status: 'In Progress', description: 'Outlook is giving a connection error for all users in the marketing department.', createdAt: '2023-04-02' },
  { id: 't3', subject: 'Printer not working', clientId: 'c1', contact: { name: 'Alice Johnson', email: 'alice@innovate.com', phone: '123-456-7890' }, assetId: 'a2', status: 'Closed', description: 'The office printer on the 2nd floor is offline and not discoverable on the network.', createdAt: '2023-03-28' },
  { id: 't4', subject: 'Software license expired', clientId: 'c3', contact: { name: 'Charlie Brown', email: 'charlie@quantum.com', phone: '345-678-9012' }, status: 'Open', description: 'Adobe Photoshop is asking for a new license key.', createdAt: '2023-04-03' },
  { id: 't5', subject: 'Slow network performance', clientId: 'c4', contact: { name: 'Diana Miller', email: 'diana@apex.com', phone: '456-789-0123' }, assetId: 'a5', status: 'In Progress', description: 'Internet speeds have been drastically slow since this morning.', createdAt: '2023-04-05' },
];

export const assets: Asset[] = [
  { id: 'a1', assetName: 'Main Web Server', type: 'Server', clientId: 'c1', purchaseDate: '2022-01-01', warrantyEnd: '2025-01-01', serialNumber: 'SN12345ABC', macAddress: '00:1B:44:11:3A:B7' },
  { id: 'a2', assetName: 'Office Printer HP', type: 'Printer', clientId: 'c1', purchaseDate: '2022-05-10', warrantyEnd: '2024-05-10', serialNumber: 'SN67890DEF' },
  { id: 'a3', assetName: 'Dell XPS 15', type: 'Laptop', clientId: 'c2', purchaseDate: '2023-01-20', warrantyEnd: '2026-01-20', serialNumber: 'SN54321GHI', macAddress: 'A4:BB:6D:7E:5C:F2' },
  { id: 'a4', assetName: 'Cisco Switch Catalyst', type: 'Network', clientId: 'c3', purchaseDate: '2021-11-15', warrantyEnd: '2026-11-15', serialNumber: 'SNABCDE123' },
  { id: 'a5', assetName: 'Fortinet Firewall', type: 'Security', clientId: 'c4', purchaseDate: '2022-08-01', warrantyEnd: '2025-08-01', serialNumber: 'SNFG100F-456' },
];
