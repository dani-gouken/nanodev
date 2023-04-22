import { useQuery, useQueryClient } from "react-query";
import { Alert } from "../../components/Alert";
import { Loader } from "../../components/Loader";
import { Request, RequestStatus, getQueries } from "../../services/query";

export function HomePage() {
    const { data, isFetching, isError } = useQuery('queries', getQueries)
    if (isFetching) {
        return (<Loader />)
    }
    if (isError) {
        return (<Alert message="An unexpected error occured" type="warning" />);
    }
    const badgeclass = (request: Request): string => {
        switch (request.status) {
            case RequestStatus.ACCEPTED:
                return "badge-success text-white";
            case RequestStatus.REJECTED:
                return "badge-error";

            default:
                return "badge-secondary";
        }
    }

    return (
        <div className="overflow-x-auto w-full">
            <table className="table w-full">
                {/* head */}
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Request</th>
                        <th>Category</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((e) => (
                        <tr key={e.ID}>
                            <td>
                                {e.ID}
                            </td>
                            <td>
                                {e.title}
                            </td>
                            <td>
                                {e.categoryLink.category.name}
                            </td>
                            <th>
                                <div className={`badge ${badgeclass(e)}`}>{e.status}</div>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
