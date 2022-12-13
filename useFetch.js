import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth";
import { useSession } from "../dashboard/hooks";
import { getToken } from "../helpers/getToken";

export const useFetch = (api, request, intento = 0, type = 0) => {
  const { userLogged } = useContext(AuthContext);
  const [location, setLocation] = useState({});
  const { incrementCounter, redirectLogin } = useSession();

  let url = `https://klumoralesv1.b1trus7panel26.com/${api}`;

  const [state, setState] = useState({
    data: "",
    isLoading: 0 != intento ? true : false,
    hasError: false,
    response: null,
    error: {},
    code: 0,
    result: {},
  });

  const getFetch = async () => {
    const { token, deviceId } = await getToken();

    let req = {
      ...request,
      token,
      deviceId,
    };

    if (1 == type) {
      req = {
        ...request,
        userId: userLogged.userId,
        sessionId: userLogged.sessionId,
        token,
        deviceId,
      };
    }

    const body = {
      method: "POST",
      credentials: "omit",
      body: JSON.stringify(req),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
    };
    setState({
      ...state,
      isLoading: true,
      data: "",
    });

    await fetch(url, body)
      .then((result) => result.json())
      .then((response) => JSON.parse(response))
      .then((allResp) =>
        allResp?.error?.errorCode === "G-014"
          ? redirectLogin(allResp)
          : setState({
              data: allResp.data,
              isLoading: false,
              hasError: "200" != allResp.code ? true : false,
              response: allResp,
              error: allResp?.error,
              code: allResp.code,
            })
      )
      .then(() => incrementCounter({ type, api, request }));
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLocation({
        latitud: position.coords.latitude,
        longitud: position.coords.longitude,
      });
    });

    if (intento > 0) {
      getFetch();
    }
  }, [intento]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    hasError: state.hasError,
    response: state.response,
    code: state.code,
    error: state.error,
    result: state.result
  };
};
