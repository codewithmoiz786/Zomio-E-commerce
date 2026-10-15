import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer';
import Scroll from './components/Scrolle'
import NotFound from './pages/Notfound';
import Spinner from './components/Spinner';


const LoginAcc = lazy(() => import("./pages/LoginAcc"))
const Account = lazy(() => import("./pages/Account"))
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"))
const Page1th = lazy(() => import("./pages/Page1th"))
const Page1 = lazy(() => import("./pages/Page1th"))
const BuyNow = lazy(() => import("./components/BuyNow"))
const Detail = lazy(() => import("./pages/Detail"))
const YourCart = lazy(() => import("./pages/YourCart"))
const Admin = lazy(() => import("./pages/Admin"))
const Myorders = lazy(() => import("./pages/Myorders"))
const About = lazy(() => import("./pages/About"))

const AppContent = () => {
  const location = useLocation()
  let hideNav = ["/login", "/signup", "/admin", "/product", "/verify-email"].some(p => location.pathname.startsWith(p))
  let hideFotter = ["/login", "/signup", "/admin"].some(p => location.pathname.startsWith(p))

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
          <Routes>
            <Route path='/' element={<><Hero /><Page1th /></>} />
            {allRoutes.map((elem, index) => {
              return <Route key={index} path={elem.path} element={elem.element} />
            })}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
        {!hideFotter && <Footer />}
      </div>
    </div>
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