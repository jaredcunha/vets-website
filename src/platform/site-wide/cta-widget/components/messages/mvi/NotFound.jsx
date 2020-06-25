import React from 'react';
import CallToActionAlert from './../../CallToActionAlert';

const NotFound = () => {
  const content = {
    heading: 'We couldn’t verify your identity',
    alertText: (
      <div>
        <p>
          We’re sorry. We couldn’t match the information you provided with what
          we have in our Veteran records. We take your privacy seriously, and
          we’re committed to protecting your information. We can’t give you
          access to our online health tools until we can match your information
          and verify your identity.
        </p>
        <p>You can verify your identity in one of these 2 ways:</p>
        <h5>Call the VA benefits hotline</h5>
        <p>
          Please call us at <a href="tel:800-827-1000">800-827-1000</a>. We’re
          here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have
          hearing loss, call TTY: 711.
        </p>
        <p>
          When the system prompts you to give a reason for your call, say,
          “eBenefits”.
        </p>
        <p>
          <strong>We’ll then ask you to tell us:</strong>
        </p>
        <ul>
          <li>
            Your full name. Please provide the last name you used while in
            service or that’s listed on your DD214 or other separation
            documents, even if you’ve since changed your name.
          </li>
          <li>Your Social Security number</li>
          <li>Your checking or savings account number</li>
          <li>
            The dollar amount of your most recent VA electronic funds transfer
            (EFT)
          </li>
        </ul>
      </div>
    ),
    status: 'error',
  };

  return <CallToActionAlert {...content} />;
};

export default NotFound;
