export default function BlobBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#EEEEDD]">
      {/* SVG Filter for metaball/gooey effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo">
            {/* Edge softness control - stdDeviation=18 allows gooey merge when blobs touch but keeps them separate when apart */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -12"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Blob container with goo filter */}
      <div className="absolute inset-0" style={{ filter: "url(#goo)" }}>
        {/* Blob 1 - Top left corner */}
        {/* Edge softness control - blur-[95px] for soft boundary */}
        <div className="blob blob-1 absolute w-[18vw] h-[18vw] rounded-full bg-[#FEFFD6] blur-[95px]" />
        
        {/* Blob 2 - Top center */}
        {/* Edge softness control - blur-[102px] for soft boundary */}
        <div className="blob blob-2 absolute w-[22vw] h-[22vw] rounded-full bg-[#FEFFD6] blur-[102px]" />
        
        {/* Blob 3 - Top right */}
        {/* Edge softness control - blur-[90px] for soft boundary */}
        <div className="blob blob-3 absolute w-[16vw] h-[16vw] rounded-full bg-[#FEFFD6] blur-[90px]" />
        
        {/* Blob 4 - Upper middle left */}
        {/* Edge softness control - blur-[98px] for soft boundary */}
        <div className="blob blob-4 absolute w-[20vw] h-[20vw] rounded-full bg-[#FEFFD6] blur-[98px]" />
        
        {/* Blob 5 - Upper middle right */}
        {/* Edge softness control - blur-[92px] for soft boundary */}
        <div className="blob blob-5 absolute w-[15vw] h-[15vw] rounded-full bg-[#FEFFD6] blur-[92px]" />
        
        {/* Blob 6 - Middle right edge */}
        {/* Edge softness control - blur-[108px] for soft boundary */}
        <div className="blob blob-6 absolute w-[24vw] h-[24vw] rounded-full bg-[#FEFFD6] blur-[108px]" />
        
        {/* Blob 7 - Center left */}
        {/* Edge softness control - blur-[96px] for soft boundary */}
        <div className="blob blob-7 absolute w-[19vw] h-[19vw] rounded-full bg-[#FEFFD6] blur-[96px]" />
        
        {/* Blob 8 - Center */}
        {/* Edge softness control - blur-[110px] for soft boundary */}
        <div className="blob blob-8 absolute w-[21vw] h-[21vw] rounded-full bg-[#FEFFD6] blur-[110px]" />
        
        {/* Blob 9 - Center right */}
        {/* Edge softness control - blur-[94px] for soft boundary */}
        <div className="blob blob-9 absolute w-[17vw] h-[17vw] rounded-full bg-[#FEFFD6] blur-[94px]" />
        
        {/* Blob 10 - Lower middle left */}
        {/* Edge softness control - blur-[104px] for soft boundary */}
        <div className="blob blob-10 absolute w-[23vw] h-[23vw] rounded-full bg-[#FEFFD6] blur-[104px]" />
        
        {/* Blob 11 - Lower middle right */}
        {/* Edge softness control - blur-[93px] for soft boundary */}
        <div className="blob blob-11 absolute w-[16vw] h-[16vw] rounded-full bg-[#FEFFD6] blur-[93px]" />
        
        {/* Blob 12 - Bottom left */}
        {/* Edge softness control - blur-[106px] for soft boundary */}
        <div className="blob blob-12 absolute w-[25vw] h-[25vw] rounded-full bg-[#FEFFD6] blur-[106px]" />
        
        {/* Blob 13 - Bottom center */}
        {/* Edge softness control - blur-[91px] for soft boundary */}
        <div className="blob blob-13 absolute w-[18vw] h-[18vw] rounded-full bg-[#FEFFD6] blur-[91px]" />
      </div>

      <style>
        {`
          .blob {
            will-change: transform;
          }

          /* Blobs positioned far apart across the screen */
          .blob-1 {
            top: -10%;
            left: -5%;
            animation: drift1 116s ease-in-out infinite;
          }

          .blob-2 {
            top: -15%;
            left: 40%;
            animation: drift2 144s ease-in-out infinite;
          }

          .blob-3 {
            top: 0%;
            right: -5%;
            animation: drift3 104s ease-in-out infinite;
          }

          .blob-4 {
            top: 20%;
            left: 15%;
            animation: drift4 156s ease-in-out infinite;
          }

          .blob-5 {
            top: 15%;
            right: 20%;
            animation: drift5 128s ease-in-out infinite;
          }

          .blob-6 {
            top: 35%;
            right: -10%;
            animation: drift6 110s ease-in-out infinite;
          }

          .blob-7 {
            top: 45%;
            left: -8%;
            animation: drift7 160s ease-in-out infinite;
          }

          .blob-8 {
            top: 40%;
            left: 40%;
            animation: drift8 100s ease-in-out infinite;
          }

          .blob-9 {
            top: 50%;
            right: 15%;
            animation: drift9 124s ease-in-out infinite;
          }

          .blob-10 {
            top: 65%;
            left: 10%;
            animation: drift10 136s ease-in-out infinite;
          }

          .blob-11 {
            top: 70%;
            right: 5%;
            animation: drift11 112s ease-in-out infinite;
          }

          .blob-12 {
            bottom: -15%;
            left: 30%;
            animation: drift12 148s ease-in-out infinite;
          }

          .blob-13 {
            bottom: -10%;
            right: 25%;
            animation: drift13 120s ease-in-out infinite;
          }

          /* Animations with large travel distances covering entire screen */
          @keyframes drift1 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(45vw, 35vh) scale(1.05);
            }
            50% {
              transform: translate(70vw, 60vh) scale(0.95);
            }
            75% {
              transform: translate(30vw, 45vh) scale(1.02);
            }
          }

          @keyframes drift2 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(-35vw, 40vh) scale(1.08);
            }
            50% {
              transform: translate(30vw, 70vh) scale(0.92);
            }
            75% {
              transform: translate(-20vw, 35vh) scale(1.05);
            }
          }

          @keyframes drift3 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(-55vw, 30vh) scale(1.06);
            }
            50% {
              transform: translate(-40vw, 65vh) scale(0.94);
            }
            75% {
              transform: translate(-65vw, 45vh) scale(1.03);
            }
          }

          @keyframes drift4 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(40vw, 45vh) scale(0.95);
            }
            50% {
              transform: translate(60vw, 25vh) scale(1.08);
            }
            75% {
              transform: translate(35vw, 55vh) scale(0.98);
            }
          }

          @keyframes drift5 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(-50vw, 50vh) scale(1.04);
            }
            50% {
              transform: translate(20vw, 40vh) scale(0.96);
            }
            75% {
              transform: translate(-35vw, 65vh) scale(1.02);
            }
          }

          @keyframes drift6 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(-50vw, 35vh) scale(1.07);
            }
            50% {
              transform: translate(-70vw, 15vh) scale(0.93);
            }
            75% {
              transform: translate(-40vw, 50vh) scale(1.04);
            }
          }

          @keyframes drift7 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(55vw, -25vh) scale(1.1);
            }
            50% {
              transform: translate(40vw, 35vh) scale(0.9);
            }
            75% {
              transform: translate(65vw, 10vh) scale(1.05);
            }
          }

          @keyframes drift8 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(-35vw, -35vh) scale(0.97);
            }
            50% {
              transform: translate(40vw, 30vh) scale(1.06);
            }
            75% {
              transform: translate(10vw, -20vh) scale(0.99);
            }
          }

          @keyframes drift9 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(-45vw, -30vh) scale(1.03);
            }
            50% {
              transform: translate(-60vw, 35vh) scale(0.97);
            }
            75% {
              transform: translate(-30vw, 15vh) scale(1.01);
            }
          }

          @keyframes drift10 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(50vw, -35vh) scale(1.05);
            }
            50% {
              transform: translate(30vw, 25vh) scale(0.95);
            }
            75% {
              transform: translate(60vw, -20vh) scale(1.02);
            }
          }

          @keyframes drift11 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(-50vw, -45vh) scale(0.96);
            }
            50% {
              transform: translate(-65vw, 15vh) scale(1.04);
            }
            75% {
              transform: translate(-40vw, -30vh) scale(0.98);
            }
          }

          @keyframes drift12 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(40vw, -45vh) scale(1.06);
            }
            50% {
              transform: translate(-30vw, -30vh) scale(0.94);
            }
            75% {
              transform: translate(55vw, -55vh) scale(1.02);
            }
          }

          @keyframes drift13 {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(-40vw, -40vh) scale(1.04);
            }
            50% {
              transform: translate(30vw, -55vh) scale(0.96);
            }
            75% {
              transform: translate(-25vw, -30vh) scale(1.01);
            }
          }
        `}
      </style>
    </div>
  );
}
