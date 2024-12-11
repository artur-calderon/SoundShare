import { notification } from "antd";
import { useEffect } from "react";

export default function Alert({ type, msm }) {
  useEffect(() => {
    notification.open({
      message: msm,
      placement: "bottomRight",
      type: type,
    });
  }, [type, msm]);

  return null;
}
