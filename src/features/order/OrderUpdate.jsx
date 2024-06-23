import Button from "../../ui/Button"
import { useFetcher } from "react-router-dom";

function OrderUpdate({ order }) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type='primary'>Make priority</Button>
    </fetcher.Form>
    );
}

export default OrderUpdate;

export async function action({request, params}) {
  const data = {priority: true};
  await updateOrder(params.orderId, data);
  return null;
};


/*
import Button from "../../ui/Button"
import { useFetcher } from "react-router-dom";


function updateOrder({order}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type='primary'>Make priority</Button>
    </fetcher.Form>
  );
}

export default updateOrder

export async function action({request, params}) {
  const data = {priority: true};
  await updateOrder(params.orderId, data);
  return null;
}
*/
