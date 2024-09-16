import React, { useEffect } from 'react';

const TomorrowWidget: React.FC = () => {
    useEffect(() => {
      const scriptId = 'tomorrow-sdk';
  
      // Check if the script already exists
      if (document.getElementById(scriptId)) {
        if (window.__TOMORROW__) {
          window.__TOMORROW__.renderWidget();
        }
        return;
      }
  
      // Create and inject the script tag
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js';
      script.async = true;
      script.defer = true;
  
      const fjs = document.getElementsByTagName('script')[0];
      fjs.parentNode?.insertBefore(script, fjs);
  
      // Cleanup function to remove the script when the component unmounts
      return () => {
        const injectedScript = document.getElementById(scriptId);
        if (injectedScript) {
          injectedScript.remove();
        }
      };
    }, []);
  
    return (
      <div className="relative">
        <div
          className="tomorrow"
          data-location-id="121592"
          data-language="EN"
          data-unit-system="METRIC"
          data-skin="dark"
          data-widget-type="aqiPollen"
          style={{ paddingBottom: '22px', position: 'relative' }}
        >
          <a
            href="https://www.tomorrow.io/weather-api/"
            rel="nofollow noopener noreferrer"
            target="_blank"
            style={{ position: 'absolute', bottom: '0', transform: 'translateX(-50%)', left: '50%' }}
          >
            <img
              alt="Powered by the Tomorrow.io Weather API"
              src="https://weather-website-client.tomorrow.io/img/powered-by.svg"
              width="250"
              height="18"
            />
          </a>
        </div>
      </div>
    );
  };
  
  export default TomorrowWidget;