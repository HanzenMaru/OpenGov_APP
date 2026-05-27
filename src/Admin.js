import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { supabase } from './supabaseClient'; // Connected directly to your client
import './Admin.css';
import { BiPlus, BiEdit, BiTrash, BiDownload, BiGridAlt, BiBarChartAlt2, BiQrScan, BiLogOut } from 'react-icons/bi';

const AdminPanel = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [projects, setProjects] = useState([]);

    // Form Fields State
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [totalBudget, setTotalBudget] = useState('');
    const [contractor, setContractor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('Ongoing');
    const [description, setDescription] = useState('');
    const [physicalProgress, setPhysicalProgress] = useState('0%');
    const [financialProgress, setFinancialProgress] = useState('0%');
    const [icon, setIcon] = useState('🏢');

    useEffect(() => {
        fetchProjects();
    }, []);

    // 🔄 FETCH PROJECTS FROM SUPABASE
    const fetchProjects = async() => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (err) {
            console.error("Error fetching projects:", err.message);
        }
    };

    // ➕ INSERT NEW PROJECT TO SUPABASE
    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('projects')
                .insert([{
                    title,
                    location,
                    total_budget: parseFloat(totalBudget) || 0,
                    contractor,
                    start_date: startDate || null,
                    end_date: endDate || null,
                    status,
                    description,
                    physical_progress: physicalProgress,
                    financial_progress: financialProgress,
                    icon
                }]);

            if (error) throw error;

            alert('Project added successfully!');
            // Clear inputs
            setTitle('');
            setLocation('');
            setTotalBudget('');
            setContractor('');
            setStartDate('');
            setEndDate('');
            setDescription('');
            setPhysicalProgress('0%');
            setFinancialProgress('0%');
            setIcon('🏢');

            fetchProjects(); // Refresh listing
            setActiveTab('projects'); // Redirect to inventory table
        } catch (err) {
            alert("Error adding project: " + err.message);
        }
    };

    // ❌ DELETE PROJECT FROM SUPABASE
    const handleDelete = async(id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProjects();
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    };

    const stats = {
        total: projects.length,
        budget: projects.reduce((acc, curr) => acc + parseFloat(curr.total_budget || 0), 0),
        ongoing: projects.filter(p => p.status === 'Ongoing').length,
        completed: projects.filter(p => p.status === 'Completed').length
    };

    const downloadQR = (id) => {
        const canvas = document.getElementById(`qr-${id}`);
        if (!canvas) return;
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `project-${id}-qr.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return ( <
        div className = "admin-container" >
        <
        aside className = "admin-sidebar" >
        <
        div className = "admin-logo" > Open < span > GOV < /span> Admin</div >
        <
        nav >
        <
        button className = { activeTab === 'dashboard' ? 'active' : '' }
        onClick = {
            () => setActiveTab('dashboard') } >
        <
        BiBarChartAlt2 / > Dashboard <
        /button> <
        button className = { activeTab === 'projects' ? 'active' : '' }
        onClick = {
            () => setActiveTab('projects') } >
        <
        BiGridAlt / > Manage Projects <
        /button> <
        button className = { activeTab === 'add' ? 'active' : '' }
        onClick = {
            () => setActiveTab('add') } >
        <
        BiPlus / > Add Project <
        /button> <
        button className = { activeTab === 'qr' ? 'active' : '' }
        onClick = {
            () => setActiveTab('qr') } >
        <
        BiQrScan / > QR Codes <
        /button> <
        /nav> <
        button className = "admin-logout-btn"
        onClick = { onLogout }
        style = {
            { marginTop: 'auto' } } >
        <
        BiLogOut / > Log Out <
        /button> <
        /aside>

        <
        main className = "admin-main" > {
            activeTab === 'dashboard' && ( <
                div className = "admin-view" >
                <
                header > < h2 > Dashboard Overview < /h2></header >
                <
                div className = "stats-grid" >
                <
                div className = "admin-stat-card" > < h3 > Total Projects < /h3><p>{stats.total}</p > < /div> <
                div className = "admin-stat-card" > < h3 > Total Budget < /h3><p>₱{stats.budget.toLocaleString()}</p > < /div> <
                div className = "admin-stat-card" > < h3 > Ongoing < /h3><p>{stats.ongoing}</p > < /div> <
                div className = "admin-stat-card" > < h3 > Completed < /h3><p>{stats.completed}</p > < /div> <
                /div> <
                /div>
            )
        }

        {
            activeTab === 'add' && ( <
                div className = "admin-view" >
                <
                header > < h2 > Add New Project < /h2></header >
                <
                form onSubmit = { handleSubmit }
                className = "project-form"
                style = {
                    { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px', background: '#fff', padding: '20px', borderRadius: '12px' } } >
                <
                input type = "text"
                placeholder = "Project Title"
                value = { title }
                onChange = {
                    (e) => setTitle(e.target.value) }
                required / >
                <
                input type = "text"
                placeholder = "Location"
                value = { location }
                onChange = {
                    (e) => setLocation(e.target.value) }
                /> <
                input type = "number"
                placeholder = "Total Budget (₱)"
                value = { totalBudget }
                onChange = {
                    (e) => setTotalBudget(e.target.value) }
                /> <
                input type = "text"
                placeholder = "Contractor"
                value = { contractor }
                onChange = {
                    (e) => setContractor(e.target.value) }
                /> <
                div style = {
                    { display: 'flex', gap: '10px' } } >
                <
                label style = {
                    { flex: 1 } } > Start Date: < input type = "date"
                value = { startDate }
                onChange = {
                    (e) => setStartDate(e.target.value) }
                /></label >
                <
                label style = {
                    { flex: 1 } } > End Date: < input type = "date"
                value = { endDate }
                onChange = {
                    (e) => setEndDate(e.target.value) }
                /></label >
                <
                /div> <
                div style = {
                    { display: 'flex', gap: '10px' } } >
                <
                input type = "text"
                placeholder = "Physical Progress (e.g. 45%)"
                value = { physicalProgress }
                onChange = {
                    (e) => setPhysicalProgress(e.target.value) }
                /> <
                input type = "text"
                placeholder = "Financial Progress (e.g. 60%)"
                value = { financialProgress }
                onChange = {
                    (e) => setFinancialProgress(e.target.value) }
                /> <
                /div> <
                div style = {
                    { display: 'flex', gap: '10px' } } >
                <
                select value = { status }
                onChange = {
                    (e) => setStatus(e.target.value) }
                style = {
                    { flex: 1 } } >
                <
                option value = "Ongoing" > Ongoing < /option> <
                option value = "Completed" > Completed < /option> <
                option value = "Suspended" > Suspended < /option> <
                /select> <
                input type = "text"
                placeholder = "Emoji Icon (e.g. 🏫)"
                value = { icon }
                onChange = {
                    (e) => setIcon(e.target.value) }
                style = {
                    { flex: 1 } }
                /> <
                /div> <
                textarea placeholder = "Project Description"
                value = { description }
                onChange = {
                    (e) => setDescription(e.target.value) }
                rows = "4" / >
                <
                button type = "submit"
                className = "btn-white-round"
                style = {
                    { background: '#1a237e', color: '#fff', padding: '12px', cursor: 'pointer', border: 'none', borderRadius: '8px' } } > Save Project < /button> <
                /form> <
                /div>
            )
        }

        {
            activeTab === 'projects' && ( <
                div className = "admin-view" >
                <
                header > < h2 > Project Database Management < /h2></header >
                <
                div style = {
                    { overflowX: 'auto', background: '#fff', padding: '15px', borderRadius: '12px' } } >
                <
                table className = "admin-table"
                style = {
                    { width: '100%', borderCollapse: 'collapse' } } >
                <
                thead >
                <
                tr style = {
                    { background: '#f4f7fa', textAlign: 'left' } } >
                <
                th > ID Code < /th> <
                th > Title < /th> <
                th > Status < /th> <
                th > Budget < /th> <
                th > Contractor < /th> <
                th > Actions < /th> <
                /tr> <
                /thead> <
                tbody > {
                    projects.map(p => ( <
                        tr key = { p.id }
                        style = {
                            { borderBottom: '1px solid #eee' } } >
                        <
                        td > { p.project_id } < /td> <
                        td > { p.title } < /td> <
                        td > < span className = { `badge ${p.status.toLowerCase()}` } > { p.status } < /span></td >
                        <
                        td > ₱{ parseFloat(p.total_budget).toLocaleString() } < /td> <
                        td > { p.contractor || 'N/A' } < /td> <
                        td >
                        <
                        button className = "action-btn delete"
                        onClick = {
                            () => handleDelete(p.id) }
                        style = {
                            { background: 'none', border: 'none', color: '#e63946', cursor: 'pointer', fontSize: '18px' } } > < BiTrash / > < /button> <
                        /td> <
                        /tr>
                    ))
                } <
                /tbody> <
                /table> <
                /div> <
                /div>
            )
        }

        {
            activeTab === 'qr' && ( <
                div className = "admin-view" >
                <
                header > < h2 > QR Code Generator < /h2></header >
                <
                div className = "qr-grid"
                style = {
                    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginTop: '20px' } } > {
                    projects.map(p => ( <
                        div className = "qr-card"
                        key = { p.id }
                        style = {
                            { background: '#fff', padding: '15px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' } } >
                        <
                        QRCodeCanvas id = { `qr-${p.id}` }
                        value = { `https://opengov.ph/project/${p.project_id}` }
                        size = { 140 }
                        level = { "H" }
                        /> <
                        p style = {
                            { fontWeight: '600', margin: '10px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } } > { p.title } < /p> <
                        button onClick = {
                            () => downloadQR(p.id) }
                        style = {
                            { display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto', padding: '6px 12px', borderRadius: '6px', border: '1px solid #1a237e', background: 'none', color: '#1a237e', cursor: 'pointer' } } > < BiDownload / > Download < /button> <
                        /div>
                    ))
                } <
                /div> <
                /div>
            )
        } <
        /main> <
        /div>
    );
};

export default AdminPanel;