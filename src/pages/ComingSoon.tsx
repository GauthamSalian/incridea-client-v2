const ComingSoon = () => {
  return (
    <>
      <style>
        {`
          @keyframes portalFlicker {
            0%, 33.33% {
              content: url('/comingsoon/on.png');
            }
            33.34%, 100% {
              content: url('/comingsoon/off.png');
            }
          }
          
          .coming-soon {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #1a0a2e;
            gap: 2rem;
          }
          
          .flicker-portal {
            animation: portalFlicker 3s infinite;
            width: 600px;
            height: auto;
          }
          
          .content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          
          .coming-soon h1 {
            color: white;
            font-size: 2rem;
            margin: 0;
          }
          
          .coming-soon p {
            color: #ccc;
            font-size: 0.9rem;
            margin: 0.5rem 0 0 0;
          }
        `}
      </style>
      <div className="coming-soon">
        <img
          src="/comingsoon/on.png"
          alt="Flickering Portal"
          className="flicker-portal"
        />
        <div className="content">
          <h1>COMING SOON</h1>
          <p>This module is still being worked across classes.</p>
          <p>Check back once she's safe to cross.</p>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
