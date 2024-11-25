import axios from "axios";
import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const Information = () => {

    const [formvalue, setFormValue]= useState({username:'', email:'', status:''});


    return (
        <div>
              <div className="container">
                <div className="row">
                    <div className="col-md-12 mt-4">
                        <p>WELCOME TO MY GALLERY</p>
                        <h5>Information</h5>


                        <form>

                        <div class="mb-3">
                            <label for="judulInformasi" class="form-label">Judul Informasi</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="judulInformasi" />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="isiInformasi" class="form-label">Isi Informasi</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="isiInformasi" />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="fotoInformasi" class="form-label">Foto Informasi</label>
                            <div class="col-sm-10">
                            <input type="file" class="form-control" id="fotoInformasi" />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="tglPost" class="form-label">Tanggal Post Info</label>
                            <div class="col-sm-10">
                            <input type="date" class="form-control" id="tglPost" />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="infoStatus" class="form-label">Status Info</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="infoStatus" />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="kdPetugas" class="form-label">KD Petugas</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="kdPetugas" />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="submitBT" class="form-label"></label>
                            <div class="col-sm-10">
                            <button name="submit" className="btn btn-success">Submit</button>
                            </div>
                        </div>

                        </form>



                    </div>
                </div>
            </div>

        </div>   
    );
}
export default Information;