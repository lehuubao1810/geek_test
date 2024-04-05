import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import ListItem from "./ListItem";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SelectMenu() {
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState({});
  const [tasks, setTasks] = useState([]);

  const [updatedTask, setUpdatedTask] = useState({});

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setPeople(data.map((person) => ({ id: person.id, name: person.name })));
        setSelected({ id: data[0].id, name: data[0].name });
      });
  }, []);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${selected.id}/todos`)
      .then((response) => response.json())
      .then((data) => {
        // sort completed tasks to the bottom
        data.sort((a, b) => a.completed - b.completed);
        setTasks(data);
        console.log(data);
      });
  }, [selected.id]);

  useEffect(() => {
    if (updatedTask.id) {
      const newTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      // sort completed tasks to the bottom
      newTasks.sort((a, b) => a.completed - b.completed);

      setTasks(newTasks);
    }
  }, [updatedTask]);

  return (
    <>
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
              User
            </Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                <span className="flex items-center">
                  <span className="ml-3 block truncate">{selected?.name}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {people.map((person) => (
                    <Listbox.Option
                      key={person.id}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {person.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>

      <h2 className="mt-6 text-sm font-semibold leading-6 text-gray-900">
        Tasks
      </h2>
      <hr className="mt-2 border-gray-200" />
      <ul role="list" className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <ListItem key={task.id} task={task} setUpdatedTask={setUpdatedTask}/>
        ))}
      </ul>
      <p className="mt-2 text-xs text-gray-500">
        {tasks.filter((task) => task.completed).length}/{tasks.length} tasks
        done
      </p>
    </>
  );
}
