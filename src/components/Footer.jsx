export default function Footer() {
  return (
    <>
      <div>
        <footer className="w-full h-fit footer footer-center text-base-content rounded bg-background text-neutral">
          {/* Display desktop */}

          <div className="w-full h-fit flex flex-row justify-center font-body md:hidden">
            <div>
              <h2 className="font-display font-medium text-xl mb-4 mt-4">
                Atelier de Flora
              </h2>
              <div className="flex flex-row gap-6 text-xs text-center justify-center mb-4 mt-4">
                <p>Shipping</p>
                <p>Contact Us</p>
              </div>
              <p className="text-base mb-4">© 2026 Atelier de Flora</p>
            </div>
          </div>

          {/* Mobile desktop */}

          <div className="hidden w-full justify-between font-body md:flex pl-16 pr-16">
         
              <div>
                <h2 className="font-display font-medium text-xl mb-4 mt-4">
                  Atelier de Flora
                </h2>
                <p className="text-base mb-4">© 2026 Atelier de Flora</p>
              </div>

              <div className="flex flex-row gap-6 text-xs text-center justify-center mb-4 mt-4">
                <p>Shipping</p>
                <p>Contact Us</p>
              </div>
   
          </div>
        </footer>
      </div>
    </>
  );
}
