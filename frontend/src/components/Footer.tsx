import React from "react";

const Footer = (): JSX.Element => (
  <footer className="page-footer font-small blue pt-4 custom-footer" style={{ backgroundColor: '#AEEEEE' }}>
    <div className="container-fluid text-center text-md-left">
      <div className="row">
        <div className="col-md-6 mt-md-0 mt-3">
          <h5 className="text-uppercase">Footer Content</h5>
          <p>Here you can use rows and columns to organize your footer content.</p>
        </div>
        <hr className="clearfix w-100 d-md-none pb-0"/>
        <div className="col-md-3 mb-md-0 mb-3">
          <h5 className="text-uppercase"> Devwares</h5>
          <ul className="list-unstyled">
            <li><a href="#!">Resources</a></li>
            <li><a href="#!">About Us</a></li>
            <li><a href="#!">Contact</a></li>
            <li><a href="#!">Blog</a></li>
          </ul>
        </div>
        <div className="col-md-3 mb-md-0 mb-3">
          <h5 className="text-uppercase"> Help</h5>
          <ul className="list-unstyled">
            <li><a href="#!">Support</a></li>
            <li><a href="#!">Sign Up</a></li>
            <li><a href="#!">Sign In</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
