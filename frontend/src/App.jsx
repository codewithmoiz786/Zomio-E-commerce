import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react'
import { FaCartShopping } from "react-icons/fa6";
import Navbar from './components/Navbar'
import Page1 from './pages/Page1th'
import Hero from './components/Hero'
import Footer from './components/Footer';
import Scroll from './components/Scrolle'
import NotFound from './pages/Notfound';
import Spinner from './components/Spinner';

const AppContent = () => {
  const location = useLocation()
  let hideNav = ["/login", "/signUp", "/admin", "/product", "/verify-email"].some(p => location.pathname.startsWith(p))
  let hideFotter = ["/login", "/signUp", "/admin"].some(p => location.pathname.startsWith(p))
  let Checkadmin = localStorage.getItem("user")

  const LoginAcc = lazy(() => import("./pages/LoginAcc"))
  const Account = lazy(() => import("./pages/Account"))
  const VerifyEmail = lazy(() => import("./pages/VerifyEmail"))
  const Page1th = lazy(() => import("./pages/Page1th"))
  const BuyNow = lazy(() => import("./components/BuyNow"))
  const Detail = lazy(() => import("./pages/Detail"))
  const YourCart = lazy(() => import("./pages/YourCart"))
  const Admin = lazy(() => import("./pages/Admin"))
  const Myorders = lazy(() => import("./pages/Myorders"))
  const About = lazy(() => import("./pages/About"))

  const allRoutes = [
    { path: "/login", element: <LoginAcc /> },
    { path: "/signup", element: <Account /> },
    { path: "/verify-email", element: <VerifyEmail /> },
    { path: "/products", element: <Page1th /> },
    { path: "/product/:id/buyNow", element: <BuyNow /> },
    { path: "/product/:id", element: <Detail /> },
    { path: "/YourCart", element: <YourCart /> },
    { path: "/admin/*", element: <Admin /> },
    { path: "/myOrders", element: <Myorders /> },
    { path: "/about", element: <About /> },
  ]
  return (
    <div>
      <Scroll />
      {!hideNav && <Navbar />}
      <div className={!hideNav ? "lg:pt-24 pt-14" : ''}>
        <Suspense fallback={<Spinner />}>

          <Routes location={location} key={location.pathname}>
            <Route path='/' element={[<Hero key={1} />, <Page1 key={2} />]} />
            {allRoutes.map((elem) => {
              return <Route path={elem.path} element={elem.element} />
            })}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
        {!hideFotter && <Footer />
        }
      </div>
    </div >
  )
}



const App = () => {

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>


  )
}

export default App