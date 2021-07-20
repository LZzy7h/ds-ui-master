export default {
    data() {
        return {
       
        }
    },
    methods: {
        themeChange(val) {
            switch (val) {
              case "gradient-blue":
                return (this.color = [
                  "#4B71F0",
                  "#3311AF",
                  "#FF4040",
                  "#FFB81C",
                  "#324274",
                  "#1E9E7E",
                ]);
      
                break;
      
              case "theme-dark":
                return (this.color = [
                  "#3312AF",
                  "#677BA4",
                  "#4B8DF1",
                  "#FFB81C",
                  "#DE3C3C",
                  "#1E9E7E"
                ]);
                break;
              case "red-theme":
                return (this.color = [
                  "#D12020",
                  "#027FF7",
                  "#8190FF",
                  "#7960FF",
                  "#324274",
                  "#1E9E7E",
                ]);
                break;
              case "green-theme":
                return (this.color = [
                  "#1DA081",
                  "#D12020",
                  "#027FF7",
                  "#FFB81C",
                  "#3312AF",
                  "#677BA4",
                ]);
                break;
              default:
                return (this.color = [
                    "#3312AF",
                    "#677BA4",
                    "#4B8DF1",
                    "#FFB81C",
                    "#DE3C3C",
                    "#1E9E7E"
                ]);
            }
          },
    }
};
