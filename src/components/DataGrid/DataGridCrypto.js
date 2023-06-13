import React, { useState, useEffect, useRef } from 'react'
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import constants from '../../constants/constants'

import './dataGridCrypto.css'

function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}

export const DataGridCrypto = ({ columns, actionColumn, url }) => {
    const [tableBuy, setTableBuy] = useState([])
    const [tableSell, setTableSell] = useState([])
    const [tableTransaction, setTableTransaction] = useState([])
    const [bestCrypto, setBestCrypto] = useState([])

    const updaterRef = useRef(null);

    useEffect(() => {
        axios.get(`${constants.baseURL}/${url}`, { withCredentials: true })
            .then((res) => {
                if (url === 'crypto') {
                    setTableBuy(res.data.toBuy)
                }
                if (url === 'crypto-sell') {
                    setTableSell(res.data.toSell)
                }
                if (url === 'transaction-history') {
                    setTableTransaction(res.data.response)
                }
            }).catch((err) => {
                console.log(err);
            })
    }, [url]);

    // Update the 'BUY' table every second
    const Update = () => {
        clearInterval(updaterRef.current);

        updaterRef.current = setInterval(() => {            
            axios.get(`${constants.baseURL}/${url}`, { withCredentials: true })
                 .then((res) => {
                    setTableBuy(res.data.toBuy);
                 }
            );
        }, 1000);
    }

    // Load the best cryptocurrencies of the last 24h
    const LoadBestCryptoData = () => {
        if (bestCrypto.length > 0) { return; } // Only load them if they are not already loaded

        axios.get(`${constants.baseURL}/bestData`, { withCredentials: true })
             .then((res) => {
                setBestCrypto(res.data.data);
             });
    }

    LoadBestCryptoData();

    if (url === 'crypto') Update();
    else clearInterval(updaterRef.current); // Stop updating the 'BUY' table if we switch to another page/tab

    return (
        <>
            <DataGrid
                rows={url === 'crypto' ? tableBuy : (url === 'crypto-sell') ? tableSell : tableTransaction}
                columns={url === 'transaction-history' ? columns : columns.concat(actionColumn)}
                pagination
                getRowId={(row) => row._id}
                pageSize={5}
                rowsPerPageOptions={[5]}
                components={{
                    Pagination: CustomPagination,
                }}
                sx={{
                    gridArea: 'datagrid',
                    marginTop: 5,
                    height: '65%',
                    marginLeft: 5,
                }}
            />

            { url !== 'transaction-history' &&
                <>
                    <div>
                        <h3>Top cryptocurrencies of the last 24h</h3>
                        <div className = "bestRow">
                            {
                                bestCrypto.length > 0 && bestCrypto.map((crypto) => (
                                    <div className = "bestCard">
                                        <h3>{crypto.name}</h3>
                                        <p>+{crypto.price}%</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <br/>
                </>
            }
        </>
    )
}
