<template>
  <div class="loading">
    <div class="body">
      <span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </span>
      <div class="base">
        <span></span>
        <div class="face"></div>
      </div>
    </div>
    <div class="longfazers">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style lang="scss">
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: -1;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);

  .body {
    position: absolute;
    top: 50%;
    left: 50%;
    animation: speeder 0.4s linear infinite;

    > span {
      position: absolute;
      top: -19px;
      left: 60px;
      width: 35px;
      height: 5px;
      border-radius: 2px 10px 1px 0;
      background: #4d5bff;

      > span:nth-child(1),
      > span:nth-child(2),
      > span:nth-child(3),
      > span:nth-child(4) {
        position: absolute;
        width: 30px;
        height: 1px;
        background: #4d5bff;
        animation: fazer1 0.2s linear infinite;
      }

      > span:nth-child(2) {
        top: 3px;
        animation: fazer2 0.4s linear infinite;
      }

      > span:nth-child(3) {
        top: 1px;
        animation: fazer3 0.4s linear infinite;
        animation-delay: -1s;
      }

      > span:nth-child(4) {
        top: 4px;
        animation: fazer4 1s linear infinite;
        animation-delay: -1s;
      }

      @keyframes fazer1 {
        0% {
          left: 0;
        }
        100% {
          left: -80px;
          opacity: 0;
        }
      }

      @keyframes fazer2 {
        0% {
          left: 0;
        }
        100% {
          left: -100px;
          opacity: 0;
        }
      }

      @keyframes fazer3 {
        0% {
          left: 0;
        }
        100% {
          left: -50px;
          opacity: 0;
        }
      }

      @keyframes fazer4 {
        0% {
          left: 0;
        }
        100% {
          left: -150px;
          opacity: 0;
        }
      }
    }

    .base {
      span {
        position: absolute;
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-right: 100px solid #4d5bff;
        border-bottom: 6px solid transparent;

        &:before {
          position: absolute;
          top: -16px;
          right: -110px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #4d5bff;
          content: '';
        }

        &:after {
          position: absolute;
          top: -16px;
          right: -98px;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-right: 55px solid #4d5bff;
          border-bottom: 16px solid transparent;
          content: '';
        }
      }

      .face {
        position: absolute;
        top: -15px;
        right: -125px;
        width: 20px;
        height: 12px;
        border-radius: 20px 20px 0 0;
        background: #4d5bff;
        transform: rotate(-40deg);

        &:after {
          position: absolute;
          top: 7px;
          right: 4px;
          width: 12px;
          height: 12px;
          border-radius: 0 0 0 2px;
          background: #4d5bff;
          content: '';
          transform: rotate(40deg);
          transform-origin: 50% 50%;
        }
      }
    }

    @keyframes speeder {
      0% {
        transform: translate(2px, 1px) rotate(0deg);
      }
      10% {
        transform: translate(-1px, -3px) rotate(-1deg);
      }
      20% {
        transform: translate(-2px, 0px) rotate(1deg);
      }
      30% {
        transform: translate(1px, 2px) rotate(0deg);
      }
      40% {
        transform: translate(1px, -1px) rotate(1deg);
      }
      50% {
        transform: translate(-1px, 3px) rotate(-1deg);
      }
      60% {
        transform: translate(-1px, 1px) rotate(0deg);
      }
      70% {
        transform: translate(3px, 1px) rotate(-1deg);
      }
      80% {
        transform: translate(-2px, -1px) rotate(1deg);
      }
      90% {
        transform: translate(2px, 1px) rotate(0deg);
      }
      100% {
        transform: translate(1px, -2px) rotate(-1deg);
      }
    }
  }

  .longfazers {
    position: absolute;
    width: 100%;
    height: 100%;

    span {
      position: absolute;
      width: 20%;
      height: 1px;
      background: #4d5bff;

      &:nth-child(1) {
        top: 20%;
        animation: lf 0.6s linear infinite;
        animation-delay: -5s;
      }

      &:nth-child(2) {
        top: 40%;
        animation: lf2 0.8s linear infinite;
        animation-delay: -1s;
      }

      &:nth-child(3) {
        top: 60%;
        animation: lf3 0.6s linear infinite;
      }

      &:nth-child(4) {
        top: 80%;
        animation: lf4 0.5s linear infinite;
        animation-delay: -3s;
      }

      @keyframes lf {
        0% {
          left: 200%;
        }
        100% {
          left: -200%;
          opacity: 0;
        }
      }
      @keyframes lf2 {
        0% {
          left: 200%;
        }
        100% {
          left: -200%;
          opacity: 0;
        }
      }
      @keyframes lf3 {
        0% {
          left: 200%;
        }
        100% {
          left: -100%;
          opacity: 0;
        }
      }
      @keyframes lf4 {
        0% {
          left: 200%;
        }
        100% {
          left: -100%;
          opacity: 0;
        }
      }
    }
  }
}
</style>
