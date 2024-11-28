import { Mail, Home, Folder, Users, User, CheckCircle, Link, FileText, Trash2, Clipboard } from "react-feather";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: "template",
    title: "Template",
    icon: <Clipboard size={20} />,
    navLink: "/template",
  },
  // {
  //   id: "inprogress",
  //   title: "In Progress",
  //   icon: <Mail size={20} />,
  //   navLink: "/inprogress",
  // },
  // {
  //   id: "waitingforothers",
  //   title: "Waiting for Others",
  //   icon: <Users size={20} />,
  //   navLink: "/waitingforothers",
  // },
  // {
  //   id: "waitingforme",
  //   title: "Waiting for Me",
  //   icon: <User size={20} />,
  //   navLink: "/waitingforme",
  // },
  // {
  //   id: "completed",
  //   title: "Completed",
  //   icon: <CheckCircle size={20} />,
  //   navLink: "/completed",
  // },
  {
    id: "bulklinks",
    title: "Public Forms",
    icon: <Link size={20} />,
    navLink: "/public_forms",
  },
  
  {
    id: "archieve",
    title: "Archive",
    icon: <FileText size={20} />,
    navLink: "/archive",
  },
  {
    id: "trash",
    title: "Trash",
    icon: <Trash2 size={20} />,
    navLink: "/trash",
  },
  // {
  //   id: "secondPage",
  //   title: "Second Page",
  //   icon: <Mail size={20} />,
  //   navLink: "/second-page",
  // },
  // {
  //   id: "folder",
  //   title: "Folder",
  //   icon: <Folder size={20} />,
  //   navLink: "/folder",
  // },
 
];
