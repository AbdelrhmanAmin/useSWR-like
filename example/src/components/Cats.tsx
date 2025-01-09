import React from "react";
import useFetch from "../../../useFetch";

const Cats = ({ id }: { id: string | number }) => {
  const { data, error, isLoading } = useFetch(
    "https://api.thecatapi.com/v1/images/search",
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
    }
  );
  return (
    <div>
      <h3>Cat #{id}</h3>
      <div>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {data && (
          <img
            src={data[0].url}
            alt="cat"
            style={{
              width: "300px",
              height: "300px",

              border: "2px solid white",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Cats;
