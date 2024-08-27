'use client'
import React from 'react';

const ButtonComponent = () => {
  const buttons = [
    { 
      name: "SalesForce - Sancor Salud", 
      color: "#3B82F6",
      url: "https://sso.sancorsalud.com.ar/auth/realms/sancorsalud/protocol/saml?SAMLRequest=jZLtb6owFMb%2FFdLvvAwEtZkuKLixgUOBKX4xXa2IQqstoPvvx95uvPfDcps0aXOec54nJ7%2Fbu0tZSA3hImd0AG4UDUiEYrbJaTYASTyRe%2BBueCtQWehHaNfVjs7JqSaiktpGKuBXZQBqTiFDIheQopIIWGEY2YEPdUWDR84qhlkBJFsIwqvWasyoqEvCI8KbHJNk7g%2FArqqOAqqqQG0ALlBRb5TyTWkfRGwZx0TBrASS05rnFFWfgf%2F0CKZc97VKBXEVtYFVTlBRiuux6k8i9SM%2BkDxnANb62G7ParJqmiIKHPv87%2F0oy81IOIm7rwILW%2Byllx6688lplMZcf9094mWArfElcxOXb704dQpsPx3QY%2BHqydQ95oU%2F61qpsDN3HPUN7Rzc52%2B5s9g0VhmVs36n17E28d56Ef15XbqvWej4F6Z7%2Bn5ZZCuNHjZaUBv0obed9o716bwZyVts%2BRcvnlgTMjWcND2KYLf2LuNzrLn1YhHvwkXCTdc32OzejKzipij3ODEWQs%2Bjjrmum%2FnTOpBPy%2FXoKbWm1uwZZYeRufdF0g3Pl%2B4pDXEiL%2B3n%2FpufEe4ZU7vdlhA18aioEK0GQNf0jqx15Zt%2BrJnQ1KFpKL1uZwWk8HvJo5x%2B4fQbI69fIgEf4jiUw%2BcoBtLLD5atAHxDCD%2Fd%2BTV9vw9GP8iB4X8Bdqte%2Bwy%2Fv3%2BzP3wH&RelayState=%2Fvisualforce%2Fsession%3Furl%3Dhttps%253A%252F%252Fsancorsalud.lightning.force.com%252Fone%252Fone.app&SigAlg=http%3A%2F%2Fwww.w3.org%2F2001%2F04%2Fxmldsig-more%23rsa-sha256&Signature=h5fMqsAB4UOb2K1ILIsrkI7bJCwMiRC004VJ%2FZYfu7Ph4iyOSWBcciZvp9r%2BqqBSLaIosY3WjYW4c6aaLxWAnuvwPyQ6KE77eQ0hOBXxPlaqA4yuYhWI1tt%2B3RABUKursSpaMjidaJmti2ayPxOoCPks%2B6QURSIbOFKPFKzsoinZzSOGnXIoP0rdkkwjR0gPsNRbfXto5jWU%2F5RTT27uoIKdSUw5kAldCt1lmkG4U3sFZiX5eMEgVNsHLgC5n9qjtSU9o7UPhcRwyVQFrdYXgBBF8fHDmdLk0KSpwcyA2%2B2phLCSdnJfd%2BL6aKp16Ij3fLr3zClyeJjwZhbSZGsCVg%3D%3D"
    },
    { 
      name: "Orion", 
      color: "#8B5CF6",
      url: "http://p-oriondb-01:8080/ingresoInterno"
    },
    { 
      name: "Plataforma de farmacias", 
      color: "#10B981",
      url: "https://www.plataformacsf.com/login.xhtml"
    },
    { 
      name: "AMB prestadores", 
      color: "#DAD100",
      url: "http://prestadoresui.ams.red/#/prestador"
    },
    { 
      name: "Convenios UI", 
      color: "#EF4444",
      url: "https://convenios.sancorsalud.com.ar/#/convenio/Buscador"
    },
    { 
      name: "Beneficio de cada plan", 
      color: "#6366F1",
      url: "https://docs.google.com/spreadsheets/d/1EBYTBtBba9NM8OtZoD2Ye0OSIH_-QUqe/edit?pli=1&gid=1972551366#gid=1972551366"
    },
    { 
      name: "Manual Farmaceutico", 
      color: "#00B9D7",
      url: "https://docs.google.com/spreadsheets/d/1GeHNHLQjdRnzl2uI6eMVy0J5a5dxqBxFQiDAvVrCIZA/edit?gid=1361535532#gid=1361535532"
    },
    { 
      name: "Planes Sancor Looker", 
      color: "#ff8400",
      url: "https://lookerstudio.google.com/u/0/reporting/ba41a3f7-31e2-4d5b-9fec-77070e93da06/page/p_8pn1i7sx5c"
    },
    {
      name: "Condiciones SupraSalud",
      color: "#FFB6C1",
      url: "https://repo.sancorsalud.com.ar/webinstitucional/assets/pdf/supra-salud/SUPRA-SALUD.pdf"
    },
  ];

  const handleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center' as const,
      marginBottom: '20px',
      color: '#333',
    },
    buttonGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
    },
    button: {
      padding: '12px 20px',
      border: 'none',
      borderRadius: '6px',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Links de Utilidad</h1>
        <div style={styles.buttonGrid}>
          {buttons.map(({ name, color, url }) => (
            <button
              key={name}
              onClick={() => handleClick(url)}
              style={{
                ...styles.button,
                backgroundColor: color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.1)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span>{name}</span>
              <span style={{ opacity: 0, transition: 'opacity 0.3s ease' }}>➜</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ButtonComponent;