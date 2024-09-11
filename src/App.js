import React, { useState } from 'react';
import { ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';
import client from './ApolloClient';
import { TaskProvider } from './context/taskcontext';
import { Button, TextField, Grid, Card, CardContent, CardActions, Typography, List } from '@mui/material';

// GraphQL queries and mutations
const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String!) {
    createTask(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: Int!, $title: String!, $description: String) {
    updateTask(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;
const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id) {
      id
      
    }
  }
`;

function TaskManager() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const { loading, error, data } = useQuery(GET_TASKS);
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    awaitRefetchQueries: true,
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    awaitRefetchQueries: true,
  });
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    awaitRefetchQueries: true,
  })

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description || '');
    setEditingTaskId(task.id);
  };
  const handleDelete = async (id) => {
    await deleteTask({
      variables: { id: id },
    });

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        // Update task
        await updateTask({
          variables: { id: editingTaskId, title, description },
        });
      } else {
        // Create new task
        await createTask({
          variables: { title, description },
        });
      }
      setTitle('');
      setDescription('');
      setEditingTaskId(null);
    } catch (error) {
      console.error("Mutation error:", error);
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Card sx={{ padding: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {editingTaskId ? "Edit Task" : "Add New Task"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                multiline
              />
              <CardActions>
                <Button
                  type="submit"
                  variant="contained"
                  color={editingTaskId ? "secondary" : "primary"}
                  fullWidth
                >
                  {editingTaskId ? "Update Task" : "Add Task"}
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Typography variant="h5" gutterBottom>
          Task List
        </Typography>
        <List>
          {data?.tasks.map((task) => (
            <Card sx={{ marginBottom: 2 }} key={task.id}>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {task.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEdit(task)}
                >
                  Update
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(task.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <TaskProvider>
        <TaskManager />
      </TaskProvider>
    </ApolloProvider>
  );
}

export default App;
