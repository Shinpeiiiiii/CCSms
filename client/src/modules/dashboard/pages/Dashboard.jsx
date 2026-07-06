import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from "../../../shared/layouts/DashboardLayout";
import { Users, CheckCircle2, BookOpen, FileText, BarChart3, ArrowRight } from 'lucide-react';

const StatCard = ({ label, value, icon, color, sub }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{
      background: '#FFFFFF',
      border: hovered ? '1px solid #1A73E8' : '1px solid #DADCE0',
      borderRadius: 18, 
      padding: '24px',
      display: 'flex', 
      flexDirection: 'column', 
      gap: 16,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: hovered ? '0 4px 12px rgba(60,64,67,0.08)' : '0 1px 2px 0 rgba(60,64,67,0.05)',
      transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#5F6368', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, margin: '0 0 6px 0' }}>
            {label}
          </p>
          <p style={{ fontFamily: 'Sora, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#202124', lineHeight: 1, margin: 0 }}>
            {value}
          </p>
          {sub && <p style={{ color: '#9AA0A6', fontSize: 12, marginTop: 6, marginBottom: 0 }}>{sub}</p>}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: color || 'rgba(26,115,232,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

const QuickLink = ({ to, label, desc, icon }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        background: hovered ? '#F8F9FA' : '#FFFFFF',
        border: hovered ? '1px solid #1A73E8' : '1px solid #DADCE0',
        borderRadius: 14, 
        padding: '18px 20px',
        display: 'flex', 
        alignItems: 'center', 
        gap: 14,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hovered ? '0 4px 10px rgba(60,64,67,0.06)' : '0 1px 2px 0 rgba(60,64,67,0.04)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'rgba(26,115,232,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#1A73E8', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 14, color: '#202124', marginBottom: 2, marginTop: 0 }}>{label}</p>
          <p style={{ color: '#5F6368', fontSize: 12, margin: 0 }}>{desc}</p>
        </div>
        <ArrowRight size={16} style={{ marginLeft: 'auto', flexShrink: 0, color: hovered ? '#1A73E8' : '#5F6368', transition: 'color 0.2s' }} />
      </div>
    </Link>
  )
}

const Dashboard = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#202124', letterSpacing: '-0.02em', marginBottom: 6, marginTop: 0 }}>
          Welcome to School Portal
        </h1>
        <p style={{ color: '#5F6368', fontSize: 14, margin: 0 }}>Here's a quick overview of your portal today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 36 }}>
        <StatCard
          label="Total Students" value="120" sub="+8 this month"
          color="rgba(26,115,232,0.08)"
          icon={<Users size={20} style={{ color: '#1A73E8' }} />}
        />
        <StatCard
          label="Attendance Rate" value="95%" sub="This academic week"
          color="rgba(52,168,83,0.08)"
          icon={<CheckCircle2 size={20} style={{ color: '#34A853' }} />}
        />
        <StatCard
          label="Active Subjects" value="8" sub="Across 4 programs"
          color="rgba(139,92,246,0.08)"
          icon={<BookOpen size={20} style={{ color: '#8B5CF6' }} />}
        />
        <StatCard
          label="Applications" value="34" sub="Pending review"
          color="rgba(251,188,4,0.08)"
          icon={<FileText size={20} style={{ color: '#FBBC04' }} />}
        />
      </div>

      {/* Quick access */}
      <div>
        <p style={{ color: '#5F6368', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, marginTop: 0 }}>
          Quick Access
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          <QuickLink to="/students" label="Manage Students" desc="View, add, or remove students"
            icon={<Users size={18} />}
          />
          <QuickLink to="/grades" label="View Grades" desc="Track and update student grades"
            icon={<BarChart3 size={18} />}
          />
          <QuickLink to="/subjects" label="Subjects" desc="Manage academic subject list"
            icon={<BookOpen size={18} />}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard