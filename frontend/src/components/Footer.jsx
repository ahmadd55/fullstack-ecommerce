
export default function Footer() {
  return (
    <>

    <footer className="footer">
        <div className="footer-container">

        <div>
            <h3>My Account</h3>
            <ul>
                <li>Login</li>
                <li>Create Account</li>
                <li>Account Info</li>
                <li>Order History</li>
                <li>Order Tracking</li>
            </ul>
            
        </div>
        <div>
            <h3>Customer Care</h3>

            <ul>
                <li>Return & Exchange Policy</li>
                <li>Shipping Policy</li>
                <li>Privacy Policy</li>
                <li>Baadmay User Manual</li>
                <li>Faqs</li>
                <li>Store Locator</li>
                <li>Contact</li>
                <li>Blogs</li>
            </ul>


        </div>
        <div>
            <h3>Find us on</h3>

            <ul>
                <li>Facebook</li>
                <li>Instagram</li>
                <li>WhatsApp</li>
             
            </ul>
        </div>

        <div>
            <h3>Signup for ideas newsletter </h3>

            <div className="newsletter">
                <p>
                    By entering your email address below, you consent to receiving our
                    newsletter with access to our latest collections, events and initiatives.
                    more details on this are provided in our Privacy Policy.
                </p>

                <form action="" className="form">

                <div className="submited">
                    <input type="text" placeholder="Enter your Email Address"/>
                    <button>Submit</button>

                </div>

                <div className="send"> 

                    <input type="text" placeholder="Whatsapp Number"/>
                    <button>Send</button>

                </div>

                </form>
            
            </div>
           
        </div>

       </div>
    </footer> 
    
    </>
  )
}
