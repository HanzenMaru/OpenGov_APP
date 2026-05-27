import React, { useState, useEffect } from 'react';
import './App.css';
import AdminPanel from './Admin';
import { supabase } from './supabaseClient';
import { IoMdHome, IoMdArrowBack } from 'react-icons/io';
import { BiScan, BiGridAlt } from 'react-icons/bi';

// --- SUB-COMPONENTS ---
const MobileNav = ({ setView }) => ( <
    div className = "mobile-nav" >
    <
    button className = "nav-item"
    onClick = {
        () => setView('dashboard')
    } >
    <
    IoMdHome size = { 28 }
    /> <
    span > Home < /span> < /
    button > <
    button className = "nav-item"
    onClick = {
        () => alert("Scanner Initializing...")
    } >
    <
    BiScan size = { 28 }
    /> <
    span > Scan < /span> < /
    button > <
    button className = "nav-item"
    onClick = {
        () => setView('projects')
    } >
    <
    BiGridAlt size = { 28 }
    /> <
    span > Projects < /span> < /
    button > <
    /div>
);

const StatCard = ({ icon, num, p, t, s }) => ( <
    div className = "stat-row" >
    <
    div className = "stat-icon-circle" > { icon } < /div> <
    div className = "stat-info" >
    <
    div className = "stat-main" >
    <
    span className = "stat-number" > { num } < /span> <
    span className = "stat-percent" > ({ p }) < /span> < /
    div > <
    div className = "stat-label" > { t } < /div> <
    div className = "stat-sublabel" > { s } < /div> < /
    div > <
    /div>
);

const ProjectCard = ({ project, onViewDetails }) => ( <
        div className = "project-card" >
        <
        div className = "project-header" >
        <
        span className = "project-title-text" > { project.title } < /span> <
        span className = "project-id-badge" > { project.project_id } < /span> < /
        div > <
        div className = "project-body" >
        <
        div className = "project-icon-box" >
        <
        span className = "project-emoji" > { project.icon || '🏢' } < /span> <
        div className = "project-meta" >
        <
        span className = "status-label" > { project.status } < /span> < /
        div > <
        /div> {
        onViewDetails && ( <
            button className = "view-details-btn"
            onClick = {
                () => onViewDetails(project)
            } >
            View Details <
            /button>
        )
    } <
    /div> <
div className = "progress-section" >
    <
    div className = "progress-bar-container" >
    <
    div className = "progress-fill physical"
style = {
    { width: project.physical_progress || '0%' }
} > < /div> <
span className = "progress-text" > { project.physical_progress || '0%' }
Physical < /span> < /
div > <
    div className = "progress-bar-container" >
    <
    div className = "progress-fill financial"
style = {
    { width: project.financial_progress || '0%' }
} > < /div> <
span className = "progress-text" > { project.financial_progress || '0%' }
Financial < /span> < /
div > <
    /div> < /
div >
);

const InfoPage = ({ title, onBack, children }) => ( <
    div className = "info-page-wrapper" >
    <
    div className = "info-header" >
    <
    IoMdArrowBack className = "back-btn"
    onClick = { onBack }
    /> <
    h1 className = "info-title" > { title } < /h1> < /
    div > <
    div className = "info-content-scroll" > { children } < /div> <
    div className = "info-footer" >
    <
    div className = "pagination-dots" >
    <
    span className = "dot active" > < /span> <
    span className = "dot" > < /span> <
    span className = "dot" > < /span> < /
    div > <
    button className = "skip-btn"
    onClick = { onBack } > Skip < /button> < /
    div > <
    /div>
);

// --- MAIN APP COMPONENT ---
function App() {
    const [view, setView] = useState('landing');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [fullNameInput, setFullNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passInput, setPassInput] = useState("");

    const [projectFilter, setProjectFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);

    // Live database project collection state
    const [projects, setProjects] = useState([]);

    // 🔄 LOAD REAL-TIME DATABASES VALUES ON STARTUP OR RE-ROUTE
    useEffect(() => {
        const loadSupabaseData = async() => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setProjects(data || []);
            } catch (err) {
                console.error("Error connecting to database state logs:", err.message);
            }
        };
        loadSupabaseData();
    }, [view]); // Automatically re-fetches whenever users toggle screens/panels back and forth!

    const menuItems = [
        { id: 'mandate', label: 'Mandate' },
        { id: 'mission', label: 'Mission' },
        { id: 'vision', label: 'Vision' },
        { id: 'privacy', label: 'Privacy Policy' },
        { id: 'about', label: 'About' }
    ];

    const handleLogin = async() => {
        try {
            if (emailInput.trim() === 'admin@example.com' && passInput === 'admin123') {
                setUserEmail('admin@example.com');
                setUserName('System Admin');
                setView('admin');
                return;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: emailInput.trim(),
                password: passInput,
            });

            if (error) throw error;

            if (data && data.user) {
                setUserEmail(data.user.email);
                const fullName = data.user.user_metadata?.full_name || data.user.email.split('@')[0];
                setUserName(fullName);

                if (data.user.email === 'admin@example.com') {
                    setView('admin');
                } else {
                    setView('dashboard');
                }
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSignup = async() => {
        try {
            const { _data, error } = await supabase.auth.signUp({
                email: emailInput.trim(),
                password: passInput,
                options: {
                    _data: { full_name: fullNameInput, role: emailInput.trim() === 'admin@example.com' ? 'admin' : 'user' }
                }
            });

            if (error) throw error;

            const { _data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: emailInput.trim(),
                password: passInput,
            });

            if (loginError) throw loginError;

            setUserEmail(loginData.user.email);
            setUserName(loginData.user.user_metadata?.full_name || emailInput.split('@')[0]);

            if (loginData.user.email === 'admin@example.com') {
                setView('admin');
            } else {
                setView('dashboard');
            }
        } catch (error) {
            alert("Registration Error: " + (error.message || "Error"));
        }
    };

    // Calculate dynamic analytics stats matching your layout rows
    const ongoingCount = projects.filter(p => p.status === 'Ongoing').length;
    const completedCount = projects.filter(p => p.status === 'Completed').length;

    if (view === 'admin_dashboard' || view === 'admin') {
        return <AdminPanel onLogout = {
            () => setView('landing')
        }
        />;
    }

    return ( <
        div className = "app-shell" > {
            isMenuOpen && < div className = "menu-overlay"
            onClick = {
                () => setIsMenuOpen(false)
            }
            />}

            <
            div className = { `side-menu ${isMenuOpen ? 'open' : ''}` } >
            <
            button className = "menu-close-btn"
            onClick = {
                () => setIsMenuOpen(false)
            } >
            <
            IoMdArrowBack / >
            <
            /button>

            <
            div className = "menu-profile" >
            <
            div className = "avatar-circle" > { userName ? userName.charAt(0).toUpperCase() : 'B' } <
            /div> <
            h3 className = "menu-user-name" > { userName || "Benjoe Magpantay" } < /h3> < /
            div >

            <
            nav className = "menu-links" > {
                menuItems.map(item => ( <
                    button key = { item.id }
                    onClick = {
                        () => {
                            setView(item.id);
                            setIsMenuOpen(false);
                        }
                    } > { item.label } <
                    /button>
                ))
            } <
            /nav>

            <
            button
            className = "menu-logout"
            onClick = {
                () => {
                    setView('landing');
                    setIsMenuOpen(false);
                }
            } >
            Log out <
            /button> < /
            div >

            <
            main className = "view-container" > {
                view === 'landing' && ( <
                    div className = "glass-card centered-content" >
                    <
                    h1 className = "logo-text main" > Open < span className = "gov-red" > GOV < /span> 24/
                    7 < /h1> <
                    p className = "hero-text" > Connecting Citizens to Government Day and Night < /p> <
                    div className = "btn-group" >
                    <
                    button className = "btn-primary"
                    onClick = {
                        () => setView('signup')
                    } > Sign up < /button> <
                    button className = "btn-outline"
                    onClick = {
                        () => setView('login')
                    } > Login < /button> < /
                    div > <
                    /div>
                )
            }

            {
                view === 'signup' && ( <
                    div className = "glass-card login-style centered-content" >
                    <
                    h2 > Create Account < /h2> <
                    div className = "form-container" >
                    <
                    label > Full Name < /label> <
                    input type = "text"
                    className = "line-input"
                    value = { fullNameInput }
                    onChange = {
                        (e) => setFullNameInput(e.target.value)
                    }
                    /> <
                    label > Email < /label> <
                    input type = "text"
                    className = "line-input"
                    value = { emailInput }
                    onChange = {
                        (e) => setEmailInput(e.target.value)
                    }
                    /> <
                    label > Password < /label> <
                    input type = "password"
                    className = "line-input"
                    value = { passInput }
                    onChange = {
                        (e) => setPassInput(e.target.value)
                    }
                    /> <
                    button className = "btn-white-round"
                    onClick = { handleSignup } > Sign Up < /button> <
                    p className = "footer-text" >
                    Already have an account ? < span className = "link-text"
                    onClick = {
                        () => setView('login')
                    } > Login < /span> < /
                    p > <
                    /div> < /
                    div >
                )
            }

            {
                view === 'login' && ( <
                    div className = "glass-card login-style centered-content" >
                    <
                    h2 > Login < /h2> <
                    div className = "form-container" >
                    <
                    label > Email < /label> <
                    input type = "text"
                    className = "line-input"
                    value = { emailInput }
                    onChange = {
                        (e) => setEmailInput(e.target.value)
                    }
                    /> <
                    label > Password < /label> <
                    input type = "password"
                    className = "line-input"
                    value = { passInput }
                    onChange = {
                        (e) => setPassInput(e.target.value)
                    }
                    /> <
                    button className = "btn-white-round"
                    onClick = { handleLogin } > Log In < /button> <
                    p className = "footer-text" >
                    Don 't have an account? <span className="link-text" onClick={() => setView('signup ')}>Register</span> < /
                    p > <
                    /div> < /
                    div >
                )
            }

            {
                view === 'dashboard' && ( <
                    div className = "dashboard-wrapper" >
                    <
                    header className = "dash-header" >
                    <
                    button className = "menu-icon"
                    onClick = {
                        () => setIsMenuOpen(true)
                    } > ☰ < /button> <
                    h1 className = "logo-text-dash" > Open < span className = "gov-red" > GOV < /span> 24/
                    7 < /h1> < /
                    header > <
                    div className = "stat-list" >
                    <
                    StatCard icon = "📝"
                    num = { projects.length }
                    p = "100%"
                    t = "Total System Records"
                    s = "Public Oversight" / >
                    <
                    StatCard icon = "✅"
                    num = { completedCount }
                    p = "Live Data"
                    t = "Completed Contracts"
                    s = "Built as Specified" / >
                    <
                    StatCard icon = "⏳"
                    num = { ongoingCount }
                    p = "Live Data"
                    t = "Ongoing Contracts"
                    s = "In Progress" / >
                    <
                    /div> <
                    MobileNav setView = { setView }
                    /> < /
                    div >
                )
            }

            {
                view === 'projects' && ( <
                    div className = "dashboard-wrapper projects-page" >
                    <
                    div className = "page-header" >
                    <
                    IoMdArrowBack className = "back-btn"
                    onClick = {
                        () => setView('dashboard')
                    }
                    /> <
                    h2 > Projects < /h2> < /
                    div > <
                    div className = "filter-bar" > {
                        ['All', 'Ongoing', 'Completed'].map(f => ( <
                            button key = { f }
                            className = { projectFilter === f ? 'active' : '' }
                            onClick = {
                                () => setProjectFilter(f)
                            } > { f } < /button>
                        ))
                    } <
                    /div> <
                    div className = "project-list-container" > {
                        projects
                        .filter(p => projectFilter === 'All' || p.status === projectFilter)
                        .map(proj => ( <
                            ProjectCard key = { proj.id }
                            project = { proj }
                            onViewDetails = {
                                (p) => {
                                    setSelectedProject(p);
                                    setView('project_details');
                                }
                            }
                            />
                        ))
                    } <
                    /div> <
                    MobileNav setView = { setView }
                    /> < /
                    div >
                )
            }

            {
                view === 'project_details' && selectedProject && ( <
                    div className = "dashboard-wrapper details-page" >
                    <
                    div className = "page-header" >
                    <
                    IoMdArrowBack className = "back-btn"
                    onClick = {
                        () => setView('projects')
                    }
                    /> <
                    h2 > Project Details < /h2> < /
                    div > <
                    div className = "details-scroll-area" >
                    <
                    ProjectCard project = { selectedProject }
                    onViewDetails = { null }
                    /> <
                    div className = "project-image-box"
                    style = {
                        { padding: '10px 0', fontSize: '15px', color: '#fff' }
                    } >
                    <
                    p > < strong > Location: < /strong> {selectedProject.location || 'Not Specified'}</p >
                    <
                    p > < strong > Contractor: < /strong> {selectedProject.contractor || 'Not Specified'}</p >
                    <
                    p style = {
                        { marginTop: '10px' }
                    } > { selectedProject.description || 'No project description added yet.' } < /p> < /
                    div > <
                    h3 > Budget Breakdown < /h3> <
                    table className = "budget-table" >
                    <
                    thead >
                    <
                    tr >
                    <
                    th > Category < /th> <
                    th > Allocated Gross Amount < /th> < /
                    tr > <
                    /thead> <
                    tbody >
                    <
                    tr >
                    <
                    td > Total Project Value < /td> <
                    td > ₱{ parseFloat(selectedProject.total_budget || 0).toLocaleString() } < /td> < /
                    tr > <
                    /tbody> < /
                    table > <
                    /div> <
                    MobileNav setView = { setView }
                    /> < /
                    div >
                )
            }

            {
                view === 'mandate' && ( <
                    InfoPage title = "Mandate"
                    onBack = {
                        () => setView('dashboard')
                    } >
                    <
                    p > OpenGov24 / 7 is mandated to serve as a digital transparency and financial information management platform... < /p> < /
                    InfoPage >
                )
            }

            {
                view === 'mission' && ( <
                    InfoPage title = "Mission"
                    onBack = {
                        () => setView('dashboard')
                    } >
                    <
                    p > To deliver an open, accessible, and user - friendly platform... < /p> < /
                    InfoPage >
                )
            }

            {
                view === 'vision' && ( <
                    InfoPage title = "Vision"
                    onBack = {
                        () => setView('dashboard')
                    } >
                    <
                    p > To become a reliable digital governance platform... < /p> < /
                    InfoPage >
                )
            }

            {
                view === 'privacy' && ( <
                    InfoPage title = "Privacy Policy"
                    onBack = {
                        () => setView('dashboard')
                    } >
                    <
                    p > OpenGov24 / 7 respects the privacy of its users... < /p> < /
                    InfoPage >
                )
            }

            {
                view === 'about' && ( <
                    InfoPage title = "About"
                    onBack = {
                        () => setView('dashboard')
                    } >
                    <
                    p > OpenGov24 / 7 is a municipal transparency and financial information management system... < /p> < /
                    InfoPage >
                )
            } <
            /main> < /
            div >
        );
    }

    export default App;