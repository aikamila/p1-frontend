import React from "react";
import './style/MailTo.css'

const MailTo = ({ email, subject = '', body = '', children }) => {
    let params = subject || body ? '?' : '';
    if (subject) params += `subject=${encodeURIComponent(subject)}`;
    if (body) params += `${subject ? '&' : ''}body=${encodeURIComponent(body)}`;
  
    return(
      <div className="mail-to__button">
        <a href={`mailto:${email}${params}`}>{children}</a>
      </div>
    );
  };




export default MailTo