import React, { useEffect, useState } from 'react';
import './App.css';
import MultiGame from './multigame';
import * as changeButtonFunctions from './components/changeButton'; // Importation de toutes les fonctions
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HighScoreBoard } from './components/HighScoreBoard';
import { selectRandomPiece } from "./reducers/randomPieceSlice";
import { selectCatalogPieces } from './reducers/catalogPiecesSlice';
import { selectMulti } from './reducers/multiSlice';
import { selectUrl } from './reducers/urlSlice';
import { selectChangeOk } from './reducers/changeOkSlice';
import { selectShowHighScore, showHighScoreOn } from './reducers/showHighScoreSlice';
import { createRoomOn } from './reducers/createRoomSlice';
import { changeTempName, selectTempName } from './reducers/tempNameSlice';
import { selectCheckUrl } from './reducers/checkUrlSlice';
import { noNameOff, selectNoName } from './reducers/noNameSlice';
import { changeOldUrl, selectOldUrl } from './reducers/oldUrlSlice';
import { changeCheckUrl } from './reducers/checkUrlSlice';
import { selectScoreList } from './reducers/scoreListSlice';

function App() {
  const catalogPieces = useSelector(selectCatalogPieces);
  const multi = useSelector(selectMulti);
  const url = useSelector(selectUrl);
  const changeOk = useSelector(selectChangeOk);
  const [temp, setTemp] = useState('');
  const tempName = useSelector(selectTempName);
  const checkUrl = useSelector(selectCheckUrl);
  const noName = useSelector(selectNoName);
  const oldUrl = useSelector(selectOldUrl);
  const scoresList = useSelector(selectScoreList);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const showHighScore = useSelector(selectShowHighScore);

  useEffect(() => {
    // Initialiser la connexion socket via le middleware
    dispatch({ type: 'SOCKET_INIT' });
  }, [dispatch]);

  useEffect(() => {
    if (tempName.length === 0) {
      dispatch(changeOldUrl(checkUrl));
      navigate("/");
    } else if (checkUrl && checkUrl.length > 3) {
      dispatch({ type: 'URL_CHECK' });
    }
  }, [checkUrl, tempName, dispatch, navigate]);

  useEffect(() => {
    if (changeOk && oldUrl.length > 0) {
      const tempUrl = oldUrl;
      dispatch(changeOldUrl(""));
      dispatch({ type: 'CREATE_PLAYER' });
      navigate(tempUrl);
    }
  }, [changeOk, oldUrl, dispatch, navigate]);

  useEffect(() => {
    if (multi && url) {
      navigate(url);
    }
  }, [multi, url, navigate]);

  useEffect(() => {
    if (url === "" && location.pathname.length > 1) {
      dispatch(changeCheckUrl(location.pathname));
    }
    navigate("/");
  }, [changeOk, url, location.pathname, dispatch, navigate]);

  const handleInputChange = (event) => {
    setTemp(event.target.value);
  };

  const handleValidation = () => {
    const sanitizedTempName = temp.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const finalTempName = sanitizedTempName.replace(/[^a-zA-Z0-9]/g, '');

    if (finalTempName.length >= 2 && finalTempName.length <= 15) {
      console.log("finaltempname = ", finalTempName);
      dispatch(changeTempName(finalTempName));
      dispatch(noNameOff());
    } else {
      alert('Name must be between 2 and 15 characters');
    }
  };

  return (
    <div className='Game'>
      <h1>Red Tetris</h1>
      <Routes>
        <Route path="/" element={
          <>
            {!noName && !showHighScore && (
              <div className="button">
                <button onClick={() => dispatch(createRoomOn())}>Create Room</button>
                <button onClick={() => dispatch(showHighScoreOn(true))}>High Score</button>
              </div>
            )}
            {noName && !showHighScore && (
              <div>
                <input type="text" id="name" placeholder="Add your name" name="name" required
                  minLength="4" maxLength="15" size="10" value={temp} onChange={handleInputChange} />
                <button onClick={handleValidation}>Validate</button>
              </div>
            )}
            {showHighScore && (
              <HighScoreBoard scoresList={scoresList} />
            )}
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
