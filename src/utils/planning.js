const NUMBER_OF_DAYS = 7;
const CENTER_IDS = [5279, 5280];

const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const buildUrl = (centerId, startDate) => {
  const params = new URLSearchParams({
    startDate,
    numberOfDays: String(NUMBER_OF_DAYS),
    idCenter: String(centerId)
  });
  return `/heitzfit/c/5279/ws/api/planning/browse?${params.toString()}`;
};

const extractItems = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  const candidates = [
    response?.planning,
    response?.items,
    response?.data,
    response?.courses,
    response?.sessions,
    response?.results
  ];

  return candidates.find(Array.isArray) ?? [];
};

const fetchBatch = async (index, initialDate) => {
  const startDate = formatDateLocal(addDays(initialDate, index * NUMBER_OF_DAYS));

  const responses = await Promise.all(
    CENTER_IDS.map((centerId) =>
      fetch(buildUrl(centerId, startDate)).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} for center ${centerId}`);
        }
        return response.json();
      })
    )
  );

  return responses.flatMap((response, responseIndex) => {
    const centerId = CENTER_IDS[responseIndex];
    return extractItems(response).map((item) => ({ ...item, center_id: centerId }));
  });
};

export { fetchBatch };
