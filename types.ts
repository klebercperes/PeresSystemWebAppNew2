import React from 'react';

export interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

export type UserRole = 'customer' | 'team';

export type TicketStatus = 'Open' | 'In Progress' | 'Closed';

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface TicketContact {
    name: string;
    email: string;
    phone: string;
    mobile?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  clientId: string;
  contact: TicketContact;
  assetId?: string;
  status: TicketStatus;
  description: string;
  notes?: string;
  attachments?: { name: string; }[];
  createdAt: string;
}

export interface Asset {
  id: string;
  assetName: string;
  type: string;
  clientId: string;
  purchaseDate: string;
  warrantyEnd: string;
  macAddress?: string;
  serialNumber?: string;
}

export interface ChartDataItem {
    label: string;
    value: number;
    color: string;
}