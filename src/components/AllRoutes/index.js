import { useRoutes } from "react-router";
import { routes } from "../../routes";

export default function AllRoutes() {
    const element = useRoutes(routes);
    return (
        <>
            {element}
        </>
    )
}