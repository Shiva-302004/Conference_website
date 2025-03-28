import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import About from "./routes/About"
import Home from "./routes/Home"
import Authors from "./routes/Authors"
import Programs from "./routes/Program"
import Sponsors from "./routes/Sponsors"
import Contact from "./routes/Contact"
import Admin from "./routes/Admin"
import Login from "./routes/Login"
import Footer from "./components/Footer"
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; 
import ProtectedRoute from "./components/ProtectedRoutes"
import AddSpeakers from "./components/AddSpeakers"
import AddPapers from "./components/AddPapers"
import AddRecentUpdates from "./components/AddRecentUpdates"
import AddAdmin from "./components/AddAdmin"
import AllPapers from "./components/AllPapers"
import AllSpeakers from "./components/AllSpeakers"
import AllUpdates from "./components/AllUpdates"
import AddPhotoGallery from "./components/AddPhotoGallery"
import { useState } from "react"
import AllPapersUser from "./components/AllPapersUser"
import AllUpdatesUser from "./components/AllUpdatesUser"
import AllImages from "./components/AllImages"

function App() {
  const [fetch,setfetch]=useState(false)
  return (
    <>
      <Navbar fetch={fetch} setfetch={setfetch}/>
      < ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/allpapers" element={<AllPapersUser />} />
        <Route path="/allupdates" element={<AllUpdatesUser />} />
        <Route path="/login" element={<Login setfetch={setfetch}/>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Admin setfetch={setfetch}/>} />
          <Route path="/admin/add-speakers" element={<AddSpeakers />} />
          <Route path="/admin/add-papers" element={<AddPapers />} />
          <Route path="/admin/add-recent-updates" element={<AddRecentUpdates />} />
          <Route path="/admin/add-admin" element={<AddAdmin />} />
          <Route path="/admin/all-papers" element={<AllPapers />} />
          <Route path="/admin/all-speakers" element={<AllSpeakers />} />
          <Route path="/admin/all-updates" element={<AllUpdates />} />
          <Route path="/admin/photogalleryupload" element={<AddPhotoGallery />} />
        </Route>
        <Route path="/all-images" element={<AllImages />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
