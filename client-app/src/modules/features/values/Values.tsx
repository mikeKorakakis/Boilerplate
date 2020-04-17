import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const VALUES = gql`
	{
		values {
			id
			name
		}
	}
`;

function Values() {
	const { loading, error, data } = useQuery(VALUES);
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :</p>;

	return (
		<div className="App">
			{data.values.map(({ id, name }: { id: number; name: string }) => (
				<p key={id}>{name}</p>
			))}
		</div>
	);
}

export default Values;
