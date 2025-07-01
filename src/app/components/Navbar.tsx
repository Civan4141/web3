import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-gradient shadow-sm mb-4 animate__animated animate__fadeInDown" style={{background: 'linear-gradient(90deg, #232526 0%, #414345 100%)', borderBottom: '2px solid #ff5252'}}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2 animate__animated animate__pulse animate__infinite" href="/">
          <i className="bi bi-emoji-sunglasses" style={{fontSize: 28, color: '#ff5252'}}></i>
          <span style={{fontWeight: 700, letterSpacing: 1, fontSize: 22, color: '#fff'}}>Dövmeci</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill fw-semibold" href="/">Anasayfa</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill fw-semibold" href="/about">Hakkımızda</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill fw-semibold" href="/contact">İletişim</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 rounded-pill fw-semibold btn btn-danger text-white" href="/appointment" style={{background: 'linear-gradient(90deg, #ff5252 0%, #b31217 100%)'}}>Randevu</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
