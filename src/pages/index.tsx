import React from 'react';
import Layout from '../components/layout/Layout';
import { mockApplications } from '../data/mockApplications';
import {LucideIcon, User, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Users, FileCheck } from 'lucide-react';
const ApplicationCard = ({ app }: { app: any }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-semibold text-gray-800">{app.applicantName}</h3>
        <p className="text-sm text-gray-600">{app.id}</p>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        app.status === 'approved' ? 'bg-green-100 text-green-800' :
        app.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {app.status.replace('_', ' ')}
      </div>
    </div>
    
    <div className="space-y-2 text-sm">
      <div className="flex items-center text-gray-600">
        <FileText className="w-4 h-4 mr-2" />
        {app.visaType.replace('_', ' ').toUpperCase()}
      </div>
      <div className="flex items-center text-gray-600">
        <Clock className="w-4 h-4 mr-2" />
        Expected: {app.expectedCompletion}
      </div>
      <div className="flex items-center text-gray-600">
        <User className="w-4 h-4 mr-2" />
        DOB: {app.dateOfBirth}
      </div>
    </div>
    
    {app.requiredDocuments.length > 0 && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-700 mb-2">Documents Status:</p>
        <div className="space-y-1">
          {app.requiredDocuments.slice(0, 2).map(({doc, index} :{doc : any , index : any}) => (
            <div key={index} className="flex items-center text-xs">
              {doc?.status === 'received' ? 
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" /> :
                <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
              }
              <span className={doc?.status === 'received' ? 'text-green-700' : 'text-red-700'}>
                {doc?.name.substring(0, 25)}...
              </span>
            </div>
          ))}
          {app.requiredDocuments.length > 2 && (
            <p className="text-xs text-gray-500">+{app.requiredDocuments.length - 2} more</p>
          )}
        </div>
      </div>
    )}
  </div>
);

const StatsCard = ({ title, value, subtitle, Icon, color = "blue" } : { title :string , value:string | number, subtitle : string, Icon: LucideIcon, color:string }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <Icon className={`w-8 h-8 text-${color}-600`} />
    </div>
  </div>
);

export default function Dashboard() {
  const totalApplications = mockApplications.length;
  const approvedCount = mockApplications.filter(app => app.status === 'approved').length;
  const pendingCount = mockApplications.filter(app => app.status !== 'approved').length;
  const automationRate = "90%";

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Real-time overview of current visa applications and their processing status.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Applications"
            value={totalApplications}
            subtitle="Active cases"
            Icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Approved Today"
            value={approvedCount}
            subtitle="Completed processing"
            Icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Pending Review"
            value={pendingCount}
            subtitle="In processing queue"
            Icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="Automation Rate"
            value={automationRate}
            subtitle="Inquiries handled by AI"
            Icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Application Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockApplications.map(app => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
        
        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">System Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Inquiries Handled Today</span>
                <span className="font-bold text-blue-600">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Response Time</span>
                <span className="font-bold text-green-600">0.8s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">User Satisfaction</span>
                <span className="font-bold text-purple-600">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Staff Time Saved</span>
                <span className="font-bold text-orange-600">6.2 hrs</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Tourist visa approved</p>
                  <p className="text-xs text-gray-500">Ahmed Hassan - 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileCheck className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Documents received</p>
                  <p className="text-xs text-gray-500">Maria Santos - 15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">New application submitted</p>
                  <p className="text-xs text-gray-500">Work permit - 1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Document deadline reminder sent</p>
                  <p className="text-xs text-gray-500">Hans Mueller - 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}