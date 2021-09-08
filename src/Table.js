import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// interface components
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

// inputs and tags
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

// Icons 
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import LanguageIcon from '@material-ui/icons/Language';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function createData(clientId, clientName, clientEmail, clientWorkPhone, clientIndustry, clientPocName, clientWebsite) {
    return { clientId, clientName, clientEmail, clientWorkPhone, clientIndustry, clientPocName, clientWebsite };
}

const headCells = [
  { id: 'clientName', numeric: false, disablePadding: true, label: 'Client Name' },
  { id: 'clientEmail', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'clientWorkPhone', numeric: true, disablePadding: false, label: 'Phone' },
  { id: 'clientIndustry', numeric: true, disablePadding: false, label: 'Industry' },
  { id: 'clientPocName', numeric: true, disablePadding: false, label: 'Point Of Contact' },
  { id: 'clientWebsite', numeric: true, disablePadding: false, label: 'Website' },
  { id: 'editInfo', numeric: true, disablePadding: false, label: '' },
];

// table head with sort handlers for each titles
function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          All Clients
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },

  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },

  padding: {
    marginLeft: theme.spacing(1)
  },

  paperAdd: {
    width: '100%',
    padding: theme.spacing(2),
  },
}));

// default table display function
export default function TableDisplay() {
  const classes = useStyles();

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('clientName');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  var rows = [];
  var tempRows = [];

  const [word, setWord] = useState([]);
  const [activePage, setActivePage] = React.useState(0);

  // Add Client form inputs
  const [cName, setCName] = useState([]);
  const [cEmail, setCEmail] = useState([]);
  const [cPhone, setCPhone] = useState([]);
  const [cIndustry, setCIndustry] = useState([]);
  const [cPName, setCPName] = useState([]);
  const [cWebsite, setCWebsite] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [finalItems, setFinalItems] = useState([]);
  const [idCounter, setIdCounter] = useState(123123123);

  // Hook API data fetch with given link
  useEffect(() => {
    fetch("http://javareesbyapi-env.eba-rtdeyeqd.ap-southeast-2.elasticbeanstalk.com/api/v1/getallclients/tenant/reesby")
    .then(res => res.json())
      .then(
        (result) => {
          tempRows = [];   
          setIsLoaded(true);
          setItems(result); 
          setFinalItems(result);          
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  // increase counter by one to display add client form
  const handleUp = () => {
    setActivePage(activePage + 1);
  };

  // decrease; hide add client form counter (checker)
  const handleDown = () => {
    setActivePage(activePage - 1);
  };
  
  // clear const state input variables
  const clearInputs = (event) => {
    // set search word to empty string
    setCName("");
    setCEmail("");
    setCPhone("");
    setCIndustry("");
    setCPName("");
    setCWebsite("");
  }

  // push newly added client to existing list
  const handleInputsSubmit = (event) => {
    // add data to new list
    if (tempData.length === 0) {
      setTempData([{
        clientId: idCounter,
        clientName: cName,
        clientEmail: cEmail,
        clientWorkPhone: cPhone,
        clientIndustry: cIndustry,
        clientPocName: cPName,
        clientWebsite: cWebsite,
      },]);
    }
    else {
      // Spread operator, add new JSON object to existing objects without losing them when calling SetState function
      setTempData(tempData => [
        ...tempData, 
        {
          clientId: idCounter,
          clientName: cName,
          clientEmail: cEmail,
          clientWorkPhone: cPhone,
          clientIndustry: cIndustry,
          clientPocName: cPName,
          clientWebsite: cWebsite,
        },
      ]);
    }

    // increment id counter, dummy
    setIdCounter(idCounter+1);

    // clear inputs after submitting form
    clearInputs();

    // call data refresh after adding new client
    refreshData();

    event.preventDefault();
  }

  // handle onSubmit event
  const handleSubmit = (event) => {
    finalItems.forEach((item) => {
      // only search within names and emails
      if (item.clientName.toLowerCase().includes(word.toLowerCase()) || item.clientEmail.toLowerCase().includes(word.toLowerCase())) 
        // push item to rows if matches search word
        tempRows.push(createData(item.clientId, item.clientName, item.clientEmail, item.clientWorkPhone, item.clientIndustry, item.clientPocName, item.clientWebsite),)        
    });

    setFinalItems(tempRows);
    event.preventDefault();
  };

  const inputWord = (event) => {    
    // call data refresh after search
    refreshData();

    // Set input search word with Hooks
    setWord(event.target.value)              
  }

  const clearSearch = (event) => {
    // call data refresh after search
    refreshData();

    // set search word to empty string
    setWord("");
  }

  function refreshData() {
    // // Re-Hook API data fetch with given link
    fetch("http://javareesbyapi-env.eba-rtdeyeqd.ap-southeast-2.elasticbeanstalk.com/api/v1/getallclients/tenant/reesby")
    .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);   

          // map to push to rows, and display accordingly
          items.map((item) => (
            // push function to call createData function defined to populate array
            tempRows.push(createData(item.clientId, item.clientName, item.clientEmail, item.clientWorkPhone, item.clientIndustry, item.clientPocName, item.clientWebsite),)
          ));
          
          if (tempData.length > 0) {
            for (var i = 0; i < tempData.length; i++) {                
              tempRows.push(createData(tempData[i].clientId, tempData[i].clientName, tempData[i].clientEmail, tempData[i].clientWorkPhone, 
                tempData[i].clientIndustry, tempData[i].clientPocName, tempData[i].clientWebsite),)        
            }
          }
          setFinalItems(tempRows);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  // sort in ascending or descending order
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // checkbox select all
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = finalItems.map((item) => item.clientId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // checkbox select one, increment when selected more
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);    
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (clientId) => selected.indexOf(clientId) !== -1;

  // checkers before pushing data to pre-defined rows variables for display
  // error and loading
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    // map to push to rows, and display accordingly
    finalItems.map((item) => (
      // push function to call createData function defined to populate array
      rows.push(createData(item.clientId, item.clientName, item.clientEmail, item.clientWorkPhone, item.clientIndustry, item.clientPocName, item.clientWebsite),)
    ));
  }

  // return full tables and data
  return (
    <React.Fragment>
        <CssBaseline />
        {/* <SearchForm /> */}
        {/* <addClient /> */}
        <p>{JSON.stringify(tempData)}</p>

        {/* display page based on button clicked */}
        {/* {getPageContent(activePage)} */}
        {activePage === 1 && (
            <Paper className={classes.paperAdd}>
              <Typography variant="h6" gutterBottom>
                  Add New Clients
              </Typography>
              <form autoComplete="off" onSubmit={handleInputsSubmit} >
                  <Grid container spacing={3}>
                      <Grid item xs={12}>
                          <TextField
                              required
                              id="clientName"
                              name="clientName"
                              label="Client Name"
                              fullWidth
                              variant="outlined" size="small"
                              value={cName} 
                              onChange={(e) => {
                                  setCName(e.target.value)
                              }}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              required
                              id="clientEmail"
                              name="clientEmail"
                              label="Email Address"
                              fullWidth
                              variant="outlined" size="small"
                              value={cEmail} 
                              onChange={(e) => {
                                  setCEmail(e.target.value)
                              }}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              required
                              id="clientWorkPhone"
                              name="clientWorkPhone"
                              label="Work Phone Number"
                              fullWidth
                              variant="outlined" size="small"
                              value={cPhone} 
                              onChange={(e) => {
                                  setCPhone(e.target.value)
                              }}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              required
                              id="clientIndustry"
                              name="clientIndustry"
                              label="Industry"
                              fullWidth
                              variant="outlined" size="small"
                              value={cIndustry} 
                              onChange={(e) => {
                                  setCIndustry(e.target.value)
                              }}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              required
                              id="clientPocName"
                              name="clientPocName"
                              label="Point of Contact"
                              fullWidth
                              variant="outlined" size="small"
                              value={cPName}
                              onChange={(e) => {
                                  setCPName(e.target.value)
                              }}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField                        
                              id="clientWebsite"
                              name="clientWebsite"
                              label="Website"
                              fullWidth
                              variant="outlined" size="small"
                              value={cWebsite} 
                              onChange={(e) => {
                                  setCWebsite(e.target.value)
                              }}
                              InputProps={{
                              // icon within textfield
                              startAdornment: (
                                  <InputAdornment position="start">
                                  <LanguageIcon />
                                  </InputAdornment>
                              ),
                              }}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                      </Grid>
      
                      <Button variant="outlined" color="primary" type="submit" className={classes.padding}>ADD</Button> 
                      <Button variant="outlined" color="primary" type="reset" onClick={clearInputs} className={classes.padding}>CLEAR</Button>
                  </Grid>
              </form>
              <br />
            </Paper>
        )}       

        <form autoComplete="off" onSubmit={handleSubmit}>
        <br />
          <Box display="flex" flexWrap="wrap">
            <Box p={1} flexGrow={1}>
              <TextField id="outlined-basic" label="Search (Names/Emails)" variant="outlined" size="small" required
                value={word} 
                onChange={inputWord} 
                InputProps={{
                  // icon within textfield
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="outlined" color="primary" type="submit" className={classes.padding}>SEARCH</Button> 
              <Button variant="outlined" color="primary" type="reset" onClick={clearSearch} className={classes.padding}>CLEAR</Button>
            </Box>
            <Box display="flex" flexWrap="wrap">
              <Box p={1}>
                {/* Show and Hide Add Client form */}
                {activePage === 0 && (
                  <Button variant="outlined" color="primary" onClick={handleUp}>
                    <AddIcon />Add Client
                  </Button>
                )}
                {activePage === 1 && (
                  <Button variant="outlined" color="primary" onClick={handleDown}>
                    <CancelIcon />Cancel
                  </Button>
                )}
              </Box>
            </Box> 
          </Box>
        </form>

        <br />

        <searchResult />

        <div className={classes.root}>
        <Paper className={classes.paper}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
            <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                aria-label="enhanced table"
            >
                <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                />
                <TableBody>                
                {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.clientId);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.clientId}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                              <Checkbox
                                onClick={(event) => handleClick(event, row.clientId)}
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                              {row.clientName}
                          </TableCell>
                          <TableCell align="right">{row.clientEmail}</TableCell>
                          <TableCell align="right">{row.clientWorkPhone}</TableCell>
                          <TableCell align="right">{row.clientIndustry}</TableCell>
                          <TableCell align="right">{row.clientPocName}</TableCell>
                          <TableCell align="right">{row.clientWebsite}</TableCell>
                          <TableCell align="right"><Button variant="outlined" color="primary"><EditIcon /></Button></TableCell>
                        </TableRow>
                      );                    
                    })}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        </div>
    </React.Fragment>
  );
}