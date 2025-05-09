export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
    auth: {
      isAuthenticated: !!localStorage.getItem("token"),
      token: localStorage.getItem("token"),
      rolId: localStorage.getItem("rol_id"),
      userId: localStorage.getItem("user_id"),
    },
    selectedField: null,
    drawnFields: {},
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("rol_id", action.payload.rolId);
      localStorage.setItem("user_id", action.payload.userId);
      return {
        ...store,
        auth: {
          isAuthenticated: true,
          token: action.payload.token,
          rolId: action.payload.rolId,
          userId: action.payload.userId,
        },
      };

    case "LOGOUT":
      localStorage.clear();
      return {
        ...store,
        auth: {
          isAuthenticated: false,
          token: null,
          rolId: null,
          userId: null,
        },
      };

    case "SET_SELECTED_FIELD":
      return {
        ...store,
        selectedField: action.payload,
      };

    case "SET_DRAWN_FIELD":
      if (!action.payload || !action.payload.fieldId) return store;
      return {
        ...store,
        drawnFields: {
          ...store.drawnFields,
          [action.payload.fieldId]: {
            geometry: action.payload.geometry,
            area: action.payload.area,
          },
        },
      };

    default:
      throw Error("Unknown action.");
  }
}
