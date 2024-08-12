import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Spinner,
  Table,
} from "react-bootstrap";

function Home() {
  const [kinds, setKinds] = useState(null);
  const loadKinds = async () => {
    try {
      const res = await APIs.get(endpoints["kinds"]);
      setKinds(res.data);

      console.log(kinds);
    } catch (ex) {
      console.error("Something wrong");
    }
  };

  useEffect(() => {
    loadKinds();
  }, []);

  return (
    <>
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <div className="content-header">
            <div className="container-fluid"></div>
            {/* /.container-fluid */}
          </div>
          {/* /.content-header */}
          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              {/* Small boxes (Stat box) */}

              {kinds === null ? (
                <Spinner animation="border" variant="info" />
              ) : (
                <>
                  <Navbar expand="lg" className="bg-body-tertiary">
                    <Container>
                      <Navbar.Brand href="#home">
                        Student Score Management
                      </Navbar.Brand>
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                          {kinds.map((k) => (
                            <Nav.Link key={k.id} href="#home">
                              Rule {k.id}
                            </Nav.Link>
                          ))}
                        </Nav>
                      </Navbar.Collapse>
                    </Container>
                  </Navbar>
                </>
              )}
              {/* /.row */}
              {/* Main row */}
              <div className="row">
                <div className="container"></div>
              </div>
              {/* /.row (main row) */}
            </div>
            {/* /.container-fluid */}
          </section>
          {/* /.content */}
        </div>
      </div>
    </>
  );
}

export default Home;
