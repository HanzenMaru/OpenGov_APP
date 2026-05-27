import React from 'react';
import { BiScan, BiGridAlt } from 'react-icons/bi';
import { IoMdHome, IoMdArrowBack } from 'react-icons/io';

// --- SUB-COMPONENTS ---
const MobileNav = ({ setView }) => ( <
    div className = "mobile-nav" >
    <
    button className = "nav-item"
    onClick = {
        () => setView('dashboard') } >
    <
    IoMdHome size = { 28 }
    /> <span>Home</span >
    <
    />button> <
    button className = "nav-item"
    onClick = {
        () => alert("Scanner Initializing...") } >
    <
    BiScan size = { 28 }
    /> <span>Scan</span >
    <
    />button> <
    button className = "nav-item"
    onClick = {
        () => setView('projects') } >
    <
    BiGridAlt size = { 28 }
    /> <span>Projects</span >
    <
    />button> < / >
    div >
);

const StatCard = ({ icon, num, p, t, s }) => ( <
    div className = "stat-row" >
    <
    div className = "stat-icon-circle" > { icon } < />div> <
    div className = "stat-info" >
    <
    div className = "stat-main" >
    <
    span className = "stat-number" > { num } < />span> <
    span className = "stat-percent" > ({ p }) < />span> < / >
    div > <
    div className = "stat-label" > { t } < />div> <
    div className = "stat-sublabel" > { s } < />div> < / >
    div > < />div>
);

const ProjectCard = ({ project, onViewDetails }) => ( <
    div className = "project-card" >
    <
    div className = "project-header" >
    <
    span className = "project-title-text" > { project.name } < />span> <
    span className = "project-id-badge" > { project.id_code } < />span> < / >
    div > <
    div className = "project-body" >
    <
    div className = "project-icon-box" >
    <
    span className = "project-emoji" > { project.icon } < />span> <
    div className = "project-meta" >
    <
    span className = "status-label" > { project.status } < />span> < / >
    div > < />div> <
    button className = "view-details-btn"
    onClick = {
        () => onViewDetails(project) } >
    View Details < />button> < / >
    div > <
    div className = "progress-section" >
    <
    div className = "progress-bar-container" >
    <
    div className = "progress-fill physical"
    style = {
        { width: project.progress1 } } > < />div> <
    span className = "progress-text" > { project.progress1 }
    Physical < />span> < / >
    div > <
    div className = "progress-bar-container" >
    <
    div className = "progress-fill financial"
    style = {
        { width: project.progress2 } } > < />div> <
    span className = "progress-text" > { project.progress2 }
    Financial < />span> < / >
    div > < />div> < / >
    div >
);

// Reusable wrapper for Information Pages (Mandate, Vision, etc.)
const InfoPage = ({ title, children, onBack, onSkip }) => ( <
    div className = "info-page-wrapper" >
    <
    div className = "info-header" >
    <
    IoMdArrowBack className = "back-btn"
    onClick = { onBack }
    /> <
    h1 className = "info-title" > { title } < />h1> < / >
    div > <
    div className = "info-content-scroll" > { children } < />div> <
    div className = "info-footer" >
    <
    div className = "pagination-dots" >
    <
    span className = "dot active" > < />span> <
    span className = "dot" > < />span> <
    span className = "dot" > < />span> < / >
    div > <
    button className = "skip-btn"
    onClick = { onSkip } > Skip < />button> < / >
    div > < />div>
);


// --- MAIN APP ---
function App() {}
const [view, setView] = useState('landing');
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [userEmail, setUserEmail] = useState("");
const [userName, setUserName] = useState("");
const [fullNameInput, setFullNameInput] = useState("");
const [emailInput, setEmailInput] = useState("");
const [passInput, setPassInput] = useState("");

const [projectFilter, setProjectFilter] = useState('All');
const [selectedProject, setSelectedProject] = useState(null);

const projectData = [
        { id }: 1, name: "Daycare Repair", id_code: "PRJ-001", status: "Completed", icon: "🏫", progress1: "100%", progress2: "100%", category: "Completed"
    },
    { id }: 2, name: "Road Improvement", id_code: "PRJ-002", status: "Ongoing", icon: "🚜", progress1: "45%", progress2: "60%", category: "Ongoing"
}, { id }: 3, name: "Solar Street Lights", id_code: "PRJ-003", status: "Ongoing", icon: "💡", progress1: "15%", progress2: "100%", category: "Ongoing"
},
];

const handleLogin = async() => {}
try {}
const { data, error } = await supabase.auth.signInWithPassword({ email }: emailInput,
password: passInput,
});
if (error) throw error;
if (data && data.user) { setUserEmail(data.user.email) };
const fullName = data.user.user_metadata ? .full_name || data.user.email.split('@')[0];
setUserName(fullName);

if (data.user.email === 'admin@example.com') { setView('admin') };
} else { setView('dashboard') };
}
}
} catch (error) { alert(error.message) };
}
};

const handleSignup = async() => {}
try {}
const { data, error } = await supabase.auth.signUp({ email }: emailInput,
password: passInput,
options: { data }: { full_name }: fullNameInput, role: 'user'
}
}
});
if (error) throw error;

const { data }: loginData, error: loginError
} = await supabase.auth.signInWithPassword({ email }: emailInput,
password: passInput,
});
if (loginError) throw loginError;

setUserEmail(loginData.user.email);
setUserName(loginData.user.user_metadata ? .full_name || emailInput.split('@')[0]);
setView('dashboard');
}
catch (error) { alert("Registration Error: " + (error.message || "Error")) };
}
};

// if (view === 'admin_dashboard') {
//   return <AdminPanel onLogout={() => setView('landing')} />;
// }
}
//   return <AdminPanel onLogout={() => setView('landing')} />;
// }

return ( <
    div className = "app-shell" > {
        isMenuOpen && < div className = "menu-overlay"
        onClick = {
            () => setIsMenuOpen(false) }
        />}

        <
        div className = { `side-menu ${isMenuOpen ? 'open' : ''}` } >
        <
        div className = "menu-profile" >
        <
        div className = "avatar-circle" > { userName ? userName.charAt(0).toUpperCase() : 'U' } < />div> <
        h3 className = "menu-user-name" > { userName || "Guest" } < />h3> <
        p className = "menu-user-email" > { userEmail || "Not logged in" } < />p> < / >
        div > <
        nav className = "menu-links" > { /* Updated menu links to match available views */ } {
            ['mandate', 'vision', 'privacy', 'contact', 'about'].map(item => ( <
                button key = { item }
                onClick = {
                    () => {
                        setView(item);
                        setIsMenuOpen(false);
                    }
                } > { item.toUpperCase() } < />button>
            ))
        } < />nav> <
        button className = "menu-logout"
        onClick = {
            () => {
                setView('landing');
                setIsMenuOpen(false);
            }
        } >
        Log out < />button> < / >
        div >

        <
        main className = "view-container" > {
            view === 'landing' && ( <
                div className = "glass-card centered-content" >
                <
                h1 className = "logo-text main" > Open < span className = "gov-red" > GOV < />span> 24/
                7 < />h1> <
                p className = "hero-text" > Connecting Citizens to Government Day and Night < />p> <
                div className = "btn-group" >
                <
                button className = "btn-primary"
                onClick = {
                    () => setView('signup') } > Sign up < />button> <
                button className = "btn-outline"
                onClick = {
                    () => setView('login') } > Login < />button> < / >
                div > < />div>
            )
        }

        {
            view === 'signup' && ( <
                div className = "glass-card login-style centered-content" >
                <
                h2 > Create Account < />h2> <
                div className = "form-container" >
                <
                label > Full Name < />label> <input type="text"
                className = "line-input"
                value = { fullNameInput }
                onChange = {
                    (e) => setFullNameInput(e.target.value) }
                /> <
                label > Email < />label> <input type="text"
                className = "line-input"
                value = { emailInput }
                onChange = {
                    (e) => setEmailInput(e.target.value) }
                /> <
                label > Password < />label> <input type="password"
                className = "line-input"
                value = { passInput }
                onChange = {
                    (e) => setPassInput(e.target.value) }
                /> <
                button className = "btn-white-round"
                onClick = { handleSignup } > Sign Up < />button> <
                p className = "footer-text" >
                Already have an account ? < span className = "link-text"
                onClick = {
                    () => setView('login') } > Login < />span> < / >
                p > < />div> < / >
                div >
            )
        }

        {
            view === 'login' && ( <
                div className = "glass-card login-style centered-content" >
                <
                h2 > Login < />h2> <
                div className = "form-container" >
                <
                label > Email < />label> <input type="text"
                className = "line-input"
                value = { emailInput }
                onChange = {
                    (e) => setEmailInput(e.target.value) }
                /> <
                label > Password < />label> <input type="password"
                className = "line-input"
                value = { passInput }
                onChange = {
                    (e) => setPassInput(e.target.value) }
                /> <
                button className = "btn-white-round"
                onClick = { handleLogin } > Log In < />button> <
                p className = "footer-text" >
                Don 't have an account? <span className="link-text" onClick={() => setView("",
                signup, ")}>Register</span> < /",
                p > <
                /div> < /,
                div >
            )
        }

        {...view === 'dashboard' && ( <
                div className = "dashboard-wrapper" >
                <
                header className = "dash-header" >
                <
                button className = "menu-icon"
                onClick = {
                    () => setIsMenuOpen(true) } > ☰ < />button> <
                h1 className = "logo-text-dash" > Open < span className = "gov-red" > GOV < />span> 24/
                7 < />h1> < / >
                header > <
                div className = "stat-list" >
                <
                StatCard icon = "📝"
                num = "1,427"
                p = "3.2%"
                t = "For Procurement"
                s = "Bidding Phase" / >
                <
                StatCard icon = "✅"
                num = "1,546"
                p = "83%"
                t = "Completed Contracts"
                s = "Built as Specified" / >
                <
                StatCard icon = "⏳"
                num = "2,648"
                p = "10%"
                t = "Ongoing Contracts"
                s = "In Progress" / >
                <
                />div> <MobileNav setView={setView} / > < />
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
                    () => setView('dashboard') }
                /> <
                h2 > Projects < />h2> < / >
                div > <
                div className = "filter-bar" > {
                    ['All', 'Ongoing', 'Completed'].map(f => ( <
                        button key = { f }
                        className = { projectFilter === f ? 'active' : '' }
                        onClick = {
                            () => setProjectFilter(f) } > { f } < />button>
                    ))
                } < />div> <
                div className = "project-list-container" > {
                    projectData.filter(p => projectFilter === 'All' || p.category === projectFilter).map(proj => ( < ProjectCard key = { proj.id }
                        project = { proj }
                        onViewDetails = {
                            (p) => {
                                setSelectedProject(p);
                                setView('project_details');
                            }
                        }
                        />
                    ))
                } < />div> <MobileNav setView={setView} / > < />
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
                    () => setView('projects') }
                /> <
                h2 > Project Details < />h2> < / >
                div > <
                div className = "details-scroll-area" >
                <
                ProjectCard project = { selectedProject }
                onViewDetails = {
                    () => {} }
                /> <
                div className = "project-image-box" >
                <
                img src = "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=400"
                alt = "site" / >
                <
                />div> <
                h3 > Budget Breakdown < />h3> <
                table className = "budget-table" >
                <
                thead >
                <
                tr > < th > Category < />th><th>Allocated</th > < th > Actual < />th></tr >
                <
                />thead> <
                tbody >
                <
                tr > < td > Materials < />td><td>₱500,000</td > < td > ₱480, 000 < />td></tr >
                <
                tr > < td > Labor < />td><td>₱200,000</td > < td > ₱195, 000 < />td></tr >
                <
                tr > < td > Equipment < />td><td>₱150,000</td > < td > ₱150, 000 < />td></tr >
                <
                />tbody> < / >
                table > < />div> <MobileNav setView={setView} / > < />
                div >
            )
        }

        { /* --- STATIC INFO VIEWS --- */ } {
            view === 'mandate' && ( <
                InfoPage title = "Mandate"
                onBack = {
                    () => setView('dashboard') }
                onSkip = {
                    () => setView('dashboard') } >
                <
                p > OpenGov24 / 7 is mandated to serve as a digital transparency and financial information management platform that supports good governance practices at the barangay and municipal levels.It is designed to align with principles of e - governance, public accountability, and open access to information by providing citizens with timely, accurate, and verifiable project data. < />p> <
                p > The system aims to complement existing government transparency initiatives by offering a technology - driven solution that allows continuous public monitoring of infrastructure projects and fund utilization. < />p> <
                h4 style = {
                    { textAlign: 'center', marginTop: '15px' } } > Functions < />h4> <
                p style = {
                    { textAlign: 'center' } } > The primary functions of OpenGov24 / 7 include the following: < />p> <
                ul >
                <
                li > < strong > QR - Based Project Information Access: < />strong> Generate and manage QR codes for government projects that link citizens to detailed project information.</ > < /li> <
                li > < strong > Public Financial Transparency: < />strong> Display project budgets, expenditures, materials used, contractor details, and implementation status in real time.</ > < /li> <
                li > < strong > Project Monitoring and Tracking: < />strong> Allow administrators to update project progress, timelines, and completion status.</ > < /li> <
                />ul> < / >
                InfoPage >
            )
        }

        {
            view === 'vision' && ( <
                InfoPage title = "Vision"
                onBack = {
                    () => setView('dashboard') }
                onSkip = {
                    () => setView('dashboard') } >
                <
                div style = {
                    { textAlign: 'center', marginTop: '20px' } } >
                <
                p > To become a reliable digital governance platform that promotes transparency, accountability, and citizen participation by providing real - time access to financial and project information of barangay and municipal initiatives through innovative and accessible technology. < />p> < / >
                div > < />InfoPage>
            )
        }

        {
            view === 'privacy' && ( <
                InfoPage title = "Privacy Policy"
                onBack = {
                    () => setView('dashboard') }
                onSkip = {
                    () => setView('dashboard') } >
                <
                p > OpenGov24 / 7 respects the privacy of its users and is committed to protecting all information handled by the system.This Privacy Policy explains how information is presented and safeguarded. < />p> <
                h4 style = {
                    { textAlign: 'center', marginTop: '15px' } } > Information Collected < />h4> <
                p > OpenGov24 / 7 is a transparency platform designed solely to display public government project information.The system presents the following data: < />p> <
                ul >
                <
                li > Project budgets and actual expenditures < />li> <
                li > Materials used and their corresponding costs < />li> <
                li > Project status and implementation details < />li> < / >
                ul > <
                p > The platform does not collect personal information, feedback, reports, or any form of user - submitted data.No user registration or login is required to access the system. < />p> < / >
                InfoPage >
            )
        }

        {
            view === 'about' && ( <
                InfoPage title = "About"
                onBack = {
                    () => setView('dashboard') }
                onSkip = {
                    () => setView('dashboard') } >
                <
                p > OpenGov24 / 7 is a municipal transparency and financial information management system designed to promote open governance, accountability, and public participation in barangay and municipal projects. < />p> <
                p > The platform uses QR - based project tracking to provide citizens with real - time access to essential project information.Each government project is assigned a unique QR code that is placed on - site.When scanned, the QR code directs users to a public portal where they can view project details such as the approved budget, actual expenditures, materials used, contractor information, project timeline, and current implementation status. < />p> <
                p > By making project information accessible anytime and anywhere, OpenGov24 / 7 aims to strengthen public trust, reduce misinformation, and encourage active citizen involvement in local governance. < />p> < / >
                InfoPage >
            )
        }

        {
            view === 'contact' && ( <
                InfoPage title = "Contact Us"
                onBack = {
                    () => setView('dashboard') }
                onSkip = {
                    () => setView('dashboard') } >
                <
                div className = "contact-card" >
                <
                div className = "contact-item" > < span > 📞 < />span> (02) 8-700-1234</ > < /div> <
                div className = "contact-item" > < span > 📱 < />span> 0917-247-2424</ > < /div> <
                div className = "contact-item" > < span > ✉️ < />span> OpenGOV247@gmail.com</ > < /div>

                <
                h3 className = "contact-subtitle" > Citizen Report < />h3> <
                div className = "contact-form" >
                <
                div className = "contact-row" >
                <
                input type = "text"
                placeholder = "Name"
                className = "contact-input-line" / >
                <
                input type = "email"
                placeholder = "Email"
                className = "contact-input-line" / >
                <
                />div> <input type="text"
                placeholder = "Message"
                className = "contact-input-line full-width" / >

                <
                div className = "contact-actions" >
                <
                button className = "btn-send-message"
                onClick = {
                    () => alert('Message Sent!') } > Send Message < />button> <
                button className = "btn-upload-photos"
                onClick = {
                    () => alert('Upload File Dialog') } >
                <
                span style = {
                    { fontSize: '24px' } } > 📸 < />span><br / > upload photos < />button> < / >
                div > < />div> < / >
                div > < />InfoPage>
            )
        } < />main> < / >
        div >
    );
}

export default App; < /></ > < /></ > < /></ > < /></ > < />)}</ > < /></ > < />)}</ > < /></ > < /></ > < /></ > < /></ > )
} < /></ > < />)}</ > < /></ > < /></ > < />)}</ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > )
} < /></ > ))
} < /></ > < /></ > )
} < /></ > < /></ > < /></ > )
}
/></ > < /></ > < /></ > < /></ > )
} < /></ > < /></ > < /></ > < /></ > < />)}</ > < /></ > < /></ > < /></ > )
} < /></ > < />))}</ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < /></ > < />);