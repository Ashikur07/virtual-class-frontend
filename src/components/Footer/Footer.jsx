const Footer = () => {
    return (
      <div className="mb-0">
        <footer className="pb-4 lg:pb-14 footer-border text-white footer lg:pl-40 p-10 bg-[#002147] text-base">
          {/* About */}
          <aside className="text-center ml-8 lg:ml-0">
            <p className="">
              <span className="text-2xl font-semibold">Virtual-Class</span>
              <br />
              A smart class representative & <br />routine management system
            </p>
          </aside>
  
          {/* Footer Links */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 items-center justify-between">
            <div className="flex text-center gap-16 lg:mx-5">
              {/* Features */}
              <div className="flex flex-col">
                <h6 className="footer-title">Features</h6>
                <a className="link link-hover">Routine Management</a>
                <a className="link link-hover">Task & Assignment</a>
                <a className="link link-hover">Attendance</a>
                <a className="link link-hover">Class Notifications</a>
              </div>
  
              {/* Support */}
              <div className="lg:ml-24 flex flex-col">
                <h6 className="footer-title">Support</h6>
                <a className="link link-hover">Help Center</a>
                <a className="link link-hover">Contact Admin</a>
                <a className="link link-hover">Student Guide</a>
                <a className="link link-hover">FAQ</a>
              </div>
            </div>
  
            {/* Legal */}
            <div className="lg:ml-28 flex flex-col text-center items-center lg:mr-20">
              <h6 className="footer-title">Legal</h6>
              <a className="link link-hover">Terms of Use</a>
              <a className="link link-hover">Privacy Policy</a>
              <a className="link link-hover">Cookie Policy</a>
            </div>
          </div>
        </footer>
      </div>
    );
  };
  
  export default Footer;
  