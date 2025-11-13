let navigator: any;

export const setNavigator = (nav: any) => {
  navigator = nav;
};

export const navigate = (to: string | number, options?: any) => {
  if (navigator) {
    navigator(to, options);
  } else {
    console.warn("Navigator is not set yet!");
  }
};