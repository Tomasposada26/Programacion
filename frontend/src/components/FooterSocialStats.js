import { FaTwitter, FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function FooterSocialStats() {
  return (
    <div className="aura-footer-socialstats">
      <div className="aura-footer-social-icons">
        <FaTwitter size={28} style={{marginRight:16, color:'#b3e0ff'}} />
        <FaFacebookF size={28} style={{marginRight:16, color:'#b3e0ff'}} />
        <FaLinkedinIn size={28} style={{marginRight:16, color:'#b3e0ff'}} />
        <FaYoutube size={28} style={{marginRight:16, color:'#b3e0ff'}} />
        <FaInstagram size={28} style={{marginRight:0, color:'#b3e0ff'}} />
      </div>
      <div className="aura-footer-socialstats-text">
        <span style={{color:'#ffe082', fontWeight:700, fontSize:20, marginRight:6}}>26,019,093,079</span>
        <span style={{color:'#b3e0ff', fontSize:18}}>Mentions delivered</span>
        <span style={{fontSize:22, marginLeft:8}}>✌️</span>
      </div>
    </div>
  );
}
